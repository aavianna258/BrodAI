from typing import Any, Dict, List
from src.packages.seo_analyzer.seo_analyzer import SeoAnalyzer
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from requests import RequestException
#from packages.product_pages.product_page_optimiser import ProductPageOptimiser
from src.packages.config.brodai_global_classes import BrodAIKeyword
from src.packages.keyword_research.keyword_research import KeywordResearcher
from dotenv import load_dotenv
import os

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
    allow_methods=["*"],  # autorise toutes les méthodes (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # autorise tous les headers
)


class AnalysisRequest(BaseModel):
    domain: str

class AnalysisResponse(BaseModel):
    status: int
    data: Dict[str, Any]


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


"""
@app.post("/generate_traffic_report")
def generate_traffic_report_and_preview(url: str) -> Dict:
    try:
        # extract text from URL
        page_content = WebpageScrapper(url).get_url_content()

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
"""


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
def keyword_research(request: KeywordRequest) -> Dict[str, List[BrodAIKeyword]]:
    main_kw = request.main_keyword

    researcher = KeywordResearcher(main_keyword=main_kw)

    top_keywords = researcher.get_top_keywords()

    return {"target_kw_report": top_keywords}


@app.post("/mock_keyword_research")
def mock_keyword_research() -> Dict[str, List[BrodAIKeyword]]:
    # on revoie des faux données
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
            },
        ]
    }



@app.post("/analysis", response_model=AnalysisResponse)
def analyze_domain(payload: AnalysisRequest):
    """
    Calls our SeoAnalyzer to run a domain analysis using SEMRush, 
    then returns the results.
    """
    domain = payload.domain

    analyzer = SeoAnalyzer(api_key=os.getenv("SEMRUSH_API_KEY"))

    try:
        analysis_data = analyzer.analyze_domain(domain)
        return AnalysisResponse(status=200, data=analysis_data)
    except Exception as e:
        return AnalysisResponse(
            status=500,
            data={"error": f"Failed to analyze domain: {str(e)}"}
        )
