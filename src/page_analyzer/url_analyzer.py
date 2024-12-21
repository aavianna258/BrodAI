from typing import Dict, List, TypedDict
from src.config.prompts import Prompts
from src.utils.other_utils import extract_keywords_json
from src.utils.openai import OpenAIClient


class BrodAIKeyword(TypedDict):
    keyword: str
    traffic : int
    difficulty : float
    intent : str

class SemRushReport(TypedDict):
    url: str
    monthly_traffic: int
    top_keywords: List[BrodAIKeyword]

class UrlAnalyzer:
    def __init__(self,url:str = ""):
        self.url=url

    def generate_sem_rush_report(self) -> SemRushReport:
        """TODO: Calls relevant methods and creaters the SemRush report on the current state of the product page"""
        url = self.url
        top_kwds = self.research_best_keywords()
        report = SemRushReport(
            {"url": url, "monthly_traffic": 0, "top_keywords": top_kwds}
        )
        return report
    
    def get_current_top_kwds(self) -> List[BrodAIKeyword]:
        """TODO: Calls SemRush API and gets current top keywords"""
    # gets current top kwds if that has not been done yet
            # Get kwds
        kwd1 = BrodAIKeyword(
            keyword="sweater",
            performance_score=50.5,
            traffic=10001,
            difficulty="easy",
        )  # TODO: remove, this is only a placeholder

        # Assemble and return output
        top_kwds = [kwd1]  # TODO: remove, this is only a placeholder
        return top_kwds

