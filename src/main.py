from typing import Any, Dict, List
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI
from requests import RequestException
from keyword_research.keyword_researcher import KeywordResearcher
from product_pages.product_page_extractor import ProductPageExtractor
from product_pages.product_page_optimiser import ProductPageOptimiser

app = FastAPI()


class EvaluatedKeyword(BaseModel):
    keyword: str
    performance_score: float
    traffic: int
    difficulty: str


class TrafficReport(BaseModel):
    url: str
    monthly_traffic: int
    top_keywords: List[EvaluatedKeyword]


@app.get("/")
def read_root() -> Dict[str, str]:
    return {"Hello": "World"}


@app.post("/generate_traffic_report")
def generate_traffic_report_and_preview(url: str) -> Dict:
    try:
        # extract text from URL
        page_content = ProductPageExtractor(url).get_url_content()

        # generate SemRush report for the current search engine performance
        researcher = KeywordResearcher(page_content)
        sr_report = researcher.generate_sem_rush_report()

        # get target keywords
        target_keywords = researcher.research_best_keywords()

        return {
            "traffic_report": sr_report,
            "target_kwd_report": target_keywords,
            "page_content": page_content,
        }

    except RequestException:
        raise RequestError("There was an issue in the system. Please try again later.")


@app.post("/optimise_product_page")
def optimise_product_page(
    product_page_content: str, target_keywords: List[str]
) -> str | Any:
    try:
        optimised_content = ProductPageOptimiser(
            product_page_content, target_keywords
        ).optimise_page_for_target_kwds()

        return optimised_content

    except RequestException:
        raise RequestError("There was an issue in the system. Please try again later.")
