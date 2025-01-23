# src/packages/seo_analyzer/seo_analyzer.py

import os
from typing import Dict, Any, List
import pandas as pd

from src.packages.utils.semrush import SemRushClient

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

    def analyze_domain(self, domain: str) -> Dict[str, Any]:
        """
        Analyzes the given domain using SemRush and returns a dictionary
        containing SEO analysis data.

        :param domain: The domain to analyze (e.g. 'example.com')
        :return: A dict with fields for monthlyTraffic, topKeywords, etc.
        """
        # 1) Use SemRush to get a domain_organic (top organic keywords) report
        #    display_limit=20 or whatever number of keywords you want
        try:
            domain_df = self.client.get_domain_report(
                report_type="domain_organic",
                domain=domain,
                region="us",
                display_limit=20,
            )
        except Exception as e:
            raise Exception(f"Failed to fetch data from SemRush: {str(e)}")

        # If no data or empty, return something minimal
        if domain_df.empty:
            return {
                "monthlyTraffic": 0,
                "scoreNumeric": 0,
                "scoreLetter": "F",
                "performanceRating": "No Data",
                "topKeywords": [],
                "nextSteps": [],
            }

        # SEMrush might return columns like: 'Keyword', 'Search Volume', 'Position'
        # We want consistent naming:
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

        # 3) Gather top 5 keywords by position
        sorted_df = domain_df.sort_values("Position", ascending=True).head(5)
        top_keywords = []
        for _, row in sorted_df.iterrows():
            top_keywords.append({
                "keyword": str(row["Keyword"]),
                "position": int(row["Position"]),
                "volume": int(row["Volume"]),
            })

        # 4) Some (very) rough scoring logic
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

        # 5) Next Steps
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

        return analysis_data
