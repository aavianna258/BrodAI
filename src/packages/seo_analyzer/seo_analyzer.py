# src/packages/seo_analyzer/seo_analyzer.py

import os
from typing import Dict, Any, List
import pandas as pd

from src.packages.utils.semrush import SemRushClient
# NEW: Import the keyword researcher
from src.packages.keyword_research.keyword_research import KeywordResearcher

class SeoAnalyzer:
    def __init__(self, api_key: str | None = None):
        """
        Initialize the SEO Analyzer with a SemRushClient.
        If api_key is not provided, we'll look for SEMRUSH_API_KEY in env.
        """
        if not api_key:
            api_key = os.getenv("SEMRUSH_API_KEY")
            if not api_key:
                raise ValueError("SEMRUSH_API_KEY not found in env or passed in constructor.")

        self.client = SemRushClient(api_key=api_key)

    def analyze_domain(self, domain: str, scraped_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyzes the given domain using SemRush and (optionally) uses scraped_info
        to feed the keyword researcher. Returns a dictionary containing SEO analysis data.

        :param domain: The domain to analyze (e.g. 'example.com')
        :param scraped_info: A dict with meta_title, meta_description, h1_list, h2_list, etc.
        :return: A dict with fields for monthlyTraffic, topKeywords, suggested_keywords, etc.
        """
        # --------------------------------------------------------------------
        # 1) SEMrush domain_organic analysis
        # --------------------------------------------------------------------
        try:
            domain_df = self.client.get_domain_report(
                report_type="domain_organic",
                domain=domain,
                region="us",
                display_limit=20,
            )
        except Exception as e:
            raise Exception(f"Failed to fetch data from SemRush: {str(e)}")

        # If no data or empty, return minimal structure
        if domain_df.empty:
            analysis_data = {
                "monthlyTraffic": 0,
                "scoreNumeric": 0,
                "scoreLetter": "F",
                "performanceRating": "No Data",
                "topKeywords": [],
                "nextSteps": [],
            }
        else:
            # SEMrush might return columns like 'Keyword', 'Search Volume', 'Position'
            # Standardize
            if "Search Volume" in domain_df.columns:
                domain_df.rename(columns={"Search Volume": "Volume"}, inplace=True)
            if "Keyword" not in domain_df.columns:
                domain_df["Keyword"] = "N/A"
            if "Position" not in domain_df.columns:
                domain_df["Position"] = 999
            if "Volume" not in domain_df.columns:
                domain_df["Volume"] = 0

            # 2) Basic monthly traffic estimate
            monthly_traffic = int(domain_df["Volume"].sum())

            # 3) Gather top 5 keywords by best (lowest) position
            sorted_df = domain_df.sort_values("Position", ascending=True).head(5)
            top_keywords = []
            for _, row in sorted_df.iterrows():
                top_keywords.append({
                    "keyword": str(row["Keyword"]),
                    "position": int(row["Position"]),
                    "volume": int(row["Volume"]),
                })

            # 4) Rough scoring logic
            if monthly_traffic < 500:
                score_numeric = 30
                performance_rating = "Needs Improvement"
                score_letter = "D"
            elif monthly_traffic < 1500:
                score_numeric = 50
                performance_rating = "Moderate"
                score_letter = "C"
            elif monthly_traffic < 3000:
                score_numeric = 70
                performance_rating = "Good"
                score_letter = "B"
            else:
                score_numeric = 90
                performance_rating = "Excellent"
                score_letter = "A"

            # 5) Next steps
            next_steps = [
                "Add more content targeting mid-volume keywords",
                "Improve on-page SEO for existing pages",
                "Optimize meta tags and headings"
            ]

            analysis_data = {
                "monthlyTraffic": monthly_traffic,
                "scoreNumeric": score_numeric,
                "scoreLetter": score_letter,
                "performanceRating": performance_rating,
                "topKeywords": top_keywords,
                "nextSteps": next_steps,
            }

        # --------------------------------------------------------------------
        # 2) Use the scraped_info to feed the KeywordResearcher
        # --------------------------------------------------------------------
        suggested_keywords = []
        if scraped_info:
            # Decide how to pick the "main_keyword" from the scraped info
            main_kw_candidate = (
                scraped_info.get("meta_title") or
                (scraped_info.get("h1_list") or [None])[0] or 
                domain
            )
            # Example:
            #  - If we have meta_title, use that
            #  - Else if we have an H1, use the first one
            #  - Else fallback to the domain

            # Now call your existing KeywordResearcher
            researcher = KeywordResearcher(main_keyword=main_kw_candidate)
            suggested_keywords = researcher.get_top_keywords()

        # Store the suggested keywords in the analysis_data
        # (the frontend can display this in a "Suggested Keywords" table)
        analysis_data["suggested_keywords"] = suggested_keywords

        return analysis_data
