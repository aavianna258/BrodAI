from typing import Any, Dict, List, Optional
from src.packages.seo_analyzer.seo_analyzer import SeoAnalyzer
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import RequestException
#from packages.product_pages.product_page_optimiser import ProductPageOptimiser
from src.packages.config.brodai_global_classes import BrodAIKeyword
from src.packages.keyword_research.keyword_research import KeywordResearcher
from src.packages.bloggers.shopify_blogger import ShopifyBlogger
from src.packages.utils.openai import OpenAIClient
from src.packages.utils.misc import extract_json

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

class PublishShopifyRequest(BaseModel):
    token: str
    store: str
    blogId: Optional[str] = None
    title: str
    content: str
    tags: List[str] = []
    published: bool = True

class CreateArticlePayload(BaseModel):
    blogId: Optional[str] = None
    title: str
    author: str
    body: str
    summary: None
    tags: List[str] = []
    isPublished: bool = False


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


@app.post("/publishShopify")
def publish_shopify_article(payload: PublishShopifyRequest):

    try:
        # 1) Initialise la classe ShopifyBlogger avec les credentials "dynamiques"
        blogger = ShopifyBlogger()
        blogger.api_token = payload.token     # on écrase la variable d'env
        blogger.shop_url = payload.store      # on écrase également la variable d'env
        print(blogger.api_token)
        # 2) Construire les données de l'article
        article_data = {
            "title": payload.title,
            "author": "Demo Author",   # ou un auteur que vous gérez autrement
            "body": payload.content,
            "tags": payload.tags,
            "summary": "Ceci est le résumé de l'article de démonstration.",
            "is_published": payload.published
        }

        # 3) Appeler la méthode create_article
        #    - blogId = payload.blogId
        #    - article = article_data (dict)
        #    - publish = payload.published (pour la publication)
        print(payload.blogId)
        response = blogger.create_article(
            blog_id = payload.blogId or "gid://shopify/Blog/114693013829",
            article=article_data,
            publish=payload.published
        )
        article_create_data = response["articleCreate"]  # KeyError si la mutation n'a pas abouti

        user_errors = article_create_data.get("userErrors", [])

        if user_errors:
            # On a des erreurs (ex: permissions, credentials invalides, format incorrect, etc.)
            return {
                "success": False,
                "error": user_errors  # renvoyer la liste d'erreurs pour les afficher au front
            }

        # Sinon, on récupère l'article créé
        created_article = article_create_data["article"]
        return {
            "success": True,
            "article": {
                "title": created_article["title"],
                #"id": created_article["id"],
                "isPublished": created_article["isPublished"]
            }
        }

    except Exception as e:
        # En cas d'erreur, on renvoie un statut 500 et un message
        return {
            "success": False,
            "error": str(e)
        }
    
#Article writer -- change this part

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
        f"L'article doit respecter les recommendations E-E-A-T de google et doit etre riche avec minimum 3000 mots."
        f"Il doit traiter tout les questions et les angles en relation avec le mot-clé :"
        f"renvoie juste le contenu de l'article en code html dans une balise <div> sans markdown ou texte supplémentaire"
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
    title_prompt = f"Propose un titre SEO optimisé en français pour ce keyword : {keyword}. Renvoie que le titre sans texte ou explication supplémentaire et pas de formatage et pas de markdown juste le text brut"
    article_title = openai_client.call_api(
        api_type="text",
        model="o1-mini",
        prompt=title_prompt,
    )

    # 5) Retourner le titre et le contenu
    return {
        "title": article_title,
        "content": article_content
    }



# ----------------------------------------------------------------------------------------
# 1) INSERT CUSTOM ASSET
# ----------------------------------------------------------------------------------------
class CustomAssetRequest(BaseModel):
    prompt: str

@app.post("/insertCustomAsset")
def insert_custom_asset(payload: CustomAssetRequest):
    """
    Reçoit un prompt décrivant un "custom/interactive asset".
    Ex: "Créer un simulateur de prix e-commerce en HTML".
    Appelle l'API OpenAI pour récupérer du code HTML.
    On renvoie uniquement la balise <div> (ou tout le HTML, selon le besoin).
    """
    prompt = payload.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Missing prompt for custom asset")

    # On crée un client OpenAI (même usage que pour generateArticle)
    openai_client = OpenAIClient()

    # Prompt pour OpenAI (o1-mini) - adapter selon vos besoins
    # On demande explicitement : "retourne moi UNIQUEMENT du code HTML. Pas de texte supplémentaire."
    full_prompt = (
        f"Tu es un assistant qui génère du code HTML pour un asset interactif.\n"
        f"Voici la demande : {prompt}.\n"
        f"Retourne uniquement du code HTML, sans aucune explication.\n"
        f"Dans ce code HTML, mets le tout dans une balise <div>.\n"
    )

    try:
        raw_html = openai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=full_prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 2) Extraire uniquement la balise <div> du résultat.
    # Méthode simple : on cherche <div ...> ... </div>
    # Vous pouvez utiliser un parseur HTML (ex. BeautifulSoup)
    # Ici, solution minimaliste par regex
    import re
    matches = re.findall(r"(<div[\s\S]*?</div>)", raw_html, flags=re.IGNORECASE)
    if matches:
        # On prend le premier match
        asset_div = matches[0]
    else:
        # Si rien trouvé, on renvoie tout
        asset_div = raw_html

    return {
        "asset_html": asset_div
    }


# ----------------------------------------------------------------------------------------
# 2) EXTERNAL LINK BUILDING
# ----------------------------------------------------------------------------------------
class ExternalLinkBuildingRequest(BaseModel):
    content: str

@app.post("/externalLinkBuilding")
def external_link_building(payload: ExternalLinkBuildingRequest):
    """
    Reçoit le contenu de l'article (HTML ou Markdown, à vous de voir),
    et demande à "o1-mini" d'insérer des liens externes de haute autorité.
    Retourne le contenu modifié.
    """
    article_content = payload.content.strip()
    if not article_content:
        raise HTTPException(status_code=400, detail="Missing article content")

    openai_client = OpenAIClient()

    # Prompt : "insère des liens externes (avec <a href=...>) dans ce contenu"
    # Adapter selon vos besoins de mise en forme.
    link_prompt = (
        f"Voici un contenu d'article:\n"
        f"{article_content}\n\n"
        f"Inclus des liens externes vers des sites d'autorité (en français). "
        f"N'ajoute pas d'explications. Retourne le contenu final HTML "
        f"avec les balises <a href='...'></a> insérées où c'est pertinent.\n"
    )

    try:
        updated_content = openai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=link_prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # On peut imaginer un "nettoyage" ou "sanitizing" ici
    # updated_content = sanitize_html(updated_content) ...
    
    return {
        "updated_content": updated_content
    }
