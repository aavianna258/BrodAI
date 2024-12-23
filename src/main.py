from typing import Any, Dict, List
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from requests import RequestException
from src.services.keyword_research import KeywordResearcher
from src.product_pages.product_page_extractor import ProductPageExtractor
from src.product_pages.product_page_optimiser import ProductPageOptimiser
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",  # ton front
    "http://127.0.0.1:3000",
    # "*",  # éventuellement plus large si nécessaire
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # autorise toutes les méthodes (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],   # autorise tous les headers
)

class KeywordRequest(BaseModel):
    main_keyword: str

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


@app.post("/keyword_research")
def keyword_research(request: KeywordRequest ):
    main_kw= request.main_keyword

    researcher=KeywordResearcher(main_keyword=main_kw)

    top_keywords = researcher.get_top_keywords()

    return {
        "target_kw_report": top_keywords  
    }


@app.post("/keyword_research_test")
def keyword_research():
    # on revoie un test
    return {
        "target_kw_report": [
            {
                "keyword": "SEO tips",
                "traffic": 1000,
                "difficulty": 0.2,
                "performance_score": 60,
            },
            {
                "keyword": "SEO guide",
                "traffic": 800,
                "difficulty": 0.4,
                "performance_score": 35,
            }
        ]
    }
