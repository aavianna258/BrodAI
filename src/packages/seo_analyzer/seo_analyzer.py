# src/packages/seo_analyzer.py

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
        containing your SEO analysis data.

        :param domain: The domain to analyze (e.g. 'example.com')
        :return: A dict with fields matching the shape your front-end expects
        """

        # 1) Use SemRush to get a domain_organic (top organic keywords) report
        domain_df: pd.DataFrame
        try:
            domain_df = self.client.get_domain_report(
                report_type="domain_organic",
                domain=domain,
                region="us",
                display_limit=10,
            )
        except Exception as e:
            raise Exception(f"Failed to fetch data from SemRush: {str(e)}")

        # 2) If no data, return something minimal
        if domain_df.empty:
            return {
                "scoreNumeric": 0,
                "scoreLetter": "F",
                "performanceRating": "No Data",
                "nextSteps": [],
                "curatedKeywords": [],
                "blogPosts": [],
                "detailedKeywords": [],
                "improvementKeywords": [],
            }

        # 3) Ensure columns exist
        if "Search Volume" not in domain_df.columns:
            domain_df["Search Volume"] = 0
        if "Keyword" not in domain_df.columns:
            domain_df["Keyword"] = "N/A"
        if "Position" not in domain_df.columns:
            domain_df["Position"] = 999

        # 4) Basic monthly traffic estimate
        monthly_traffic = int(domain_df["Volume"].sum())

        # 5) Pick top 3 keywords by position
        sorted_df = domain_df.sort_values("Position", ascending=True).head(3)
        top_keywords = []
        for _, row in sorted_df.iterrows():
            top_keywords.append({
                "title": str(row["Keyword"]),
                "snippet": f"Position {row['Position']} with ~{row['Volume']} volume",
            })

        # 6) Scoring logic
        if monthly_traffic < 500:
            score_numeric = 30
            performance_rating = "Needs Improvement"
            score_letter = "D"
        elif monthly_traffic < 1500:
            score_numeric = 50
            performance_rating = "Moderate"
            score_letter = "C"
        else:
            score_numeric = 70
            performance_rating = "Good"
            score_letter = "B"

        # 7) Build final data structure
        analysis_data = {
            "scoreNumeric": score_numeric,
            "scoreLetter": score_letter,
            "performanceRating": performance_rating,
            "nextSteps": [
                "Add more content targeting mid-volume keywords",
                "Improve on-page SEO for existing pages"
            ],
            "curatedKeywords": ["handmade rug", "bohemian decor"],  # placeholders
            "blogPosts": top_keywords,
            "detailedKeywords": [
                {
                    "keyword": "Fashion Bold",
                    "currentPosition": 40,
                    "potentialTraffic": 300,
                    "competitionLevel": "Medium",
                },
                {
                    "keyword": "handmade carpets",
                    "currentPosition": 25,
                    "potentialTraffic": 450,
                    "competitionLevel": "High",
                }
            ],
            "improvementKeywords": [
                {
                    "keyword": "luxury bohemian rug",
                    "reason": "Trending with moderate difficulty"
                },
                {
                    "keyword": "best boho decor",
                    "reason": "High monthly searches, easy to rank"
                }
            ],
        }

        return analysis_data
