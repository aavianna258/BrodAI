from typing import Any, Dict, List
from packages.utils.openai import OpenAIClient
from src.packages.seo_analyzer.seo_analyzer import SeoAnalyzer
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import RequestException
#from packages.product_pages.product_page_optimiser import ProductPageOptimiser
from src.packages.config.brodai_global_classes import BrodAIKeyword
from src.packages.keyword_research.keyword_research import KeywordResearcher
from dotenv import load_dotenv
from src.packages.utils.webpage_scrapper import WebpageScrapper
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


@app.post("/summarize_site")
def demo_kwd_research_from_domain(site_url: str) -> Dict[str, List[BrodAIKeyword]]:
    try:
        # 1) Extract h1/h2, meta_title, meta_description
        scraped_info = WebpageScrapper(site_url).extract_website_info()

        ai_client = OpenAIClient()
        prompt = (
            f"Summarize the content of this website in a passage of a maximum of 10 words. "
            f"Just give me the passage please. Here is some info about the site: {scraped_info}."
        )
        summary = ai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=prompt,
        )
        main_kw = summary
        print(main_kw)
        researcher = KeywordResearcher(main_keyword=main_kw)
        top_keywords = researcher.get_top_keywords()

        return {"target_kw_report": top_keywords}

    except Exception as e:
        return {"status": 500, "data": {"error": str(e)}}
    
    
@app.post("/generateArticle")
def generate_article(payload: KeywordRequest):
    """
    Reçoit un mot-clé et génère un titre + contenu d'article via OpenAI.
    """
    keyword = payload.main_keyword
    if not keyword:
        raise HTTPException(status_code=400, detail="Missing 'keyword'")

    # 1) Initialiser notre client OpenAI
    openai_client = OpenAIClient()  # charge OPENAI_API_KEY depuis .env

    # 2) Construire un prompt
    prompt = (
        f"Tu es un expert SEO. "
        f"Rédige un court article en ciblant le mot-clé : {keyword}. "
        f"renvoie juste le contenu de l'article en code html dans une balise <div> sans markdown ou texte supplémentaire"
        f"N'incluez pas de titre mais faites des introductions et des sous-titres pour les différentes sections de l'article."
        f"La langue du titre et de l'article doit correspondre à la langue du mot-clé."
        f"L'article doit respecter les recommendations E-E-A-T de google et doit etre riche avec 2000 mots plus ou moins."
        f"Il doit traiter tout les questions et les angles en relation avec le mot-clé :"
        f"le contenu va etre utilisé dans la section content des blog posts shopify c'est pour ça que ça doit rentrer dans une balise div et sans balise h1 ( qui est résérvé pour le titre)"
    )

    # 3) Appel à l'API OpenAI (modèle chat) via call_api(..., api_type="text", ...)
    #    NB: "gpt-3.5-turbo" ou "gpt-4" selon votre abonnement
    #    Ajoutez d'autres paramètres (temperature, max_tokens...) si besoin
    article_content = openai_client.call_api(
        api_type="text",
        model="o1-mini",
        prompt=prompt,
    )

    # 4) Générer un titre succinct (option 1 : prompt séparé, option 2 : dans le même prompt)
    #    Ici, on fait un prompt séparé pour illustrer.
    title_prompt = f"Propose un titre SEO optimisé pour ce keyword : {keyword}. Renvoie que le titre sans texte ou explication supplémentaire et pas de formatage et pas de markdown juste le text brut"
    article_title = openai_client.call_api(
        api_type="text",
        model="o1-mini",
        prompt=title_prompt,
    )

    # 5) Retourner le titre et le contenu
    return {"title": article_title, "content": article_content}