from typing import Any, Dict, List, Optional
from src.packages.seo_analyzer.seo_analyzer import SeoAnalyzer
from httpx import RequestError
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# from packages.product_pages.product_page_optimiser import ProductPageOptimiser
from src.packages.config.brodai_global_classes import BrodAIKeyword
from src.packages.keyword_research.keyword_research import KeywordResearcher
from src.packages.bloggers.shopify_blogger import ShopifyBlogger
from src.packages.utils.openai import OpenAIClient
from src.packages.utils.web_scraper import extract_website_info

import httpx
from dotenv import load_dotenv
import json
import re
from bs4 import BeautifulSoup


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


@app.post("/keyword_research")
def keyword_research(request: KeywordRequest) -> Dict[str, List[BrodAIKeyword]]:
    main_kw = request.main_keyword

    researcher = KeywordResearcher(main_keyword=main_kw)

    top_keywords = researcher.get_top_keywords()

    return {"target_kw_report": top_keywords}


class AnalysisRequest(BaseModel):
    domain: str


class AnalysisResponse(BaseModel):
    status: int
    data: Dict[str, Any]


@app.post("/analysis")
def analyze_domain(payload: AnalysisRequest):
    domain = payload.domain
    analyzer = SeoAnalyzer()

    try:
        # 1) Extract h1/h2, meta_title, meta_description
        scraped_info = extract_website_info(domain)

        # 2) Pass domain + scraped_info to the SeoAnalyzer
        analysis_data = analyzer.analyze_domain(domain, scraped_info)

        # 3) Optionally, also attach the scraped info so the frontend can see it
        analysis_data["scraped_info"] = scraped_info

        return {"status": 200, "data": analysis_data}
    except Exception as e:
        return {"status": 500, "data": {"error": str(e)}}

    except ValueError as ve:
        # If the site scraping fails or is invalid
        return AnalysisResponse(status=500, data={"error": f"Scraper error: {str(ve)}"})
    except Exception as e:
        # General fallback
        return AnalysisResponse(
            status=500, data={"error": f"Failed to analyze domain: {str(e)}"}
        )


@app.post("/publishShopify")
def publish_shopify_article(payload: PublishShopifyRequest):
    try:
        # 1) Initialise la classe ShopifyBlogger avec les credentials "dynamiques"
        blogger = ShopifyBlogger()
        blogger.api_token = payload.token  # on écrase la variable d'env
        blogger.shop_url = payload.store  # on écrase également la variable d'env

        # 2) Construire les données de l'article
        article_data = {
            "title": payload.title,
            "author": "Demo Author",  # ou un auteur que vous gérez autrement
            "body": payload.content,
            "tags": payload.tags,
            "summary": "Ceci est le résumé de l'article de démonstration.",
            "is_published": payload.published,
        }

        # 3) Appeler la méthode create_article
        #    - blogId = payload.blogId
        #    - article = article_data (dict)
        #    - publish = payload.published (pour la publication)
        print(payload.blogId)
        response = blogger.create_article(
            blog_id=payload.blogId or "gid://shopify/Blog/114693013829",
            article=article_data,
            publish=payload.published,
        )
        article_create_data = response[
            "articleCreate"
        ]  # KeyError si la mutation n'a pas abouti

        user_errors = article_create_data.get("userErrors", [])

        if user_errors:
            # On a des erreurs (ex: permissions, credentials invalides, format incorrect, etc.)
            return {
                "success": False,
                "error": user_errors,  # renvoyer la liste d'erreurs pour les afficher au front
            }

        # Sinon, on récupère l'article créé
        created_article = article_create_data["article"]
        return {
            "success": True,
            "article": {
                "title": created_article["title"],
                # "id": created_article["id"],
                "isPublished": created_article["isPublished"],
            },
        }

    except Exception as e:
        # En cas d'erreur, on renvoie un statut 500 et un message
        return {"success": False, "error": str(e)}


# Article writer -- change this part


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
    return {"title": article_title, "content": article_content}


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

    return {"asset_html": asset_div}


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

    return {"updated_content": updated_content}


# ----------------------------------------------------------------------------------------
# 3) RefineContent feature
# ----------------------------------------------------------------------------------------


class RefineContentRequest(BaseModel):
    content: str
    refine_instruction: str


@app.post("/refineContent")
def refine_content(payload: RefineContentRequest):
    """
    Receives the current content (HTML) and some "refine_instruction".
    For example, "Make the tone more formal" or "Shorten the second paragraph" etc.
    Returns updated content.
    """
    content = payload.content.strip()
    instruction = payload.refine_instruction.strip()

    if not content:
        raise HTTPException(status_code=400, detail="Missing content for refinement")

    if not instruction:
        raise HTTPException(status_code=400, detail="Missing refine instruction")

    # 1) Initialize OpenAI
    openai_client = OpenAIClient()

    # 2) Construct a prompt
    # For example:
    prompt = (
        f"Voici le contenu HTML suivant:\n"
        f"{content}\n\n"
        f"Instruction de refinement: {instruction}\n\n"
        f"Retourne le texte HTML modifié en respectant l'instruction. "
        f"renvoie juste le contenu de l'article en code html dans une balise <div> sans markdown ou texte supplémentaire"
        f"Ne rajoute pas d'explications, seulement le contenu final."
    )

    try:
        refined_content = openai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"updated_content": refined_content}


########################################
# NOUVELLE ROUTE: /insertCTAs
########################################
class InsertCTAsRequest(BaseModel):
    content: str
    useBrodAiCTAs: bool
    wantsCTA: bool
    ctaCount: int
    ctaValues: List[str]


@app.post("/insertCTAs")
def insert_ctas(payload: InsertCTAsRequest):
    """
    Insertion de CTA dans le contenu HTML.
    - Si useBrodAiCTAs = True => on laisse GPT générer le(s) CTA
    - Sinon on utilise la liste ctaValues pour injecter manuellement X CTA.
    """
    content = payload.content.strip()
    cta_count = payload.ctaCount
    if not content:
        raise HTTPException(status_code=400, detail="Missing content")

    # Cas 1: On laisse GPT "deviner" la/les CTA(s)
    if payload.useBrodAiCTAs:
        openai_client = OpenAIClient()
        prompt = (
            f"Voici un article HTML:\n{content}\n\n"
            f"Insère {cta_count} CTA (boutons) en français, "
            f"avec un design très moderne et il doit etre centré,"
            f"où c'est pertinent, en utilisant une balise <div class='cta-button'>"
            f" ou similaire. Ne renvoie que le HTML final.\n"
        )
        try:
            updated_content = openai_client.call_api(
                api_type="text",
                model="o1-mini",
                prompt=prompt,
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Cas 2: On a un array ctaValues => On injecte ces CTA manuellement
    else:
        # On peut, par exemple, ajouter chaque CTA à la fin d'un paragraphe,
        # ou tout simplement coller en bas de l'article. Exemple simplifié:
        updated_content = content
        for cta_text in payload.ctaValues:
            # Ex. on insère un petit HTML
            updated_content += f"\n<div class='cta-button'>{cta_text}</div>\n"

    return {"updated_content": updated_content}


########################################
# NOUVELLE ROUTE: /applyImages
########################################
class ApplyImagesRequest(BaseModel):
    content: str
    imageStrategy: str  # 'ownURL' | 'brodAi' | 'aiGenerated'
    imageCount: int
    images: List[str]  # contiendra soit URL ou prompt


@app.post("/applyImages")
def apply_images(payload: ApplyImagesRequest):
    """
    Insère des images dans l'article HTML selon la stratégie:
    - ownURL => l'utilisateur fournit directement l'URL
    - brodAi => (ex: on laisse GPT choisir des images, si tu implémente un micro-service d'images)
    - aiGenerated => on appelle DALL-E/OpenAI image creation
    """
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="No content provided")

    if payload.imageStrategy == "ownURL":
        # On insère les URLs fournies directement dans le HTML
        updated_content = content
        for url in payload.images:
            updated_content += f"\n<img src='{url}' alt='Image' />\n"

    elif payload.imageStrategy == "brodAi":
        # (Exemple à adapter) => simple placeholder
        # On peut imaginer que tu as un service qui renvoie des URLs d'images
        # en fonction du sujet. Ici on fait juste un placeholder.
        updated_content = content
        for i in range(payload.imageCount):
            updated_content += f"\n<img src='https://via.placeholder.com/600?text=BrodAI+Image#{i+1}' alt='BrodAI image' />\n"

    elif payload.imageStrategy == "aiGenerated":
        # Ex: on appelle OpenAI DALL-E / Stable Diffusion, etc.
        # On suppose que "images" contient des prompts, on génère des URLs.
        # NB: la classe OpenAIClient devrait avoir une méthode pour générer des images (à implémenter).
        openai_client = OpenAIClient()
        updated_content = content
        for prompt in payload.images:
            try:
                image_url = openai_client.call_api(
                    api_type="image", model="dall-e-3", prompt=prompt
                )
                # On suppose que call_api(..., api_type="images") renvoie directement un url
                updated_content += f"\n<img src='{image_url}' alt='{prompt}' />\n"
            except Exception:
                # En cas d'erreur, on insère un fallback
                updated_content += "\n<img src='https://via.placeholder.com/600?text=Error+Image' alt='Error' />\n"
    else:
        updated_content = content

    return {"updated_content": updated_content}


class TechnicalAuditRequest(BaseModel):
    store: Optional[str] = None
    token: Optional[str] = None
    blog_id: Optional[str] = None
    article_content: Optional[str] = None
    title: Optional[str] = None


class TechnicalAuditResponse(BaseModel):
    recommendations: List[Dict[str, Any]] = []
    original_content: Optional[str] = None


class ApplyTechnicalAuditRequest(BaseModel):
    original_content: str
    audit_report: List[Dict[str, Any]]


class ApplyTechnicalAuditResponse(BaseModel):
    updated_content: str


# ==== Cette fonction parse le JSON renvoyé par l'IA,
#      en essayant plusieurs stratégies ====


def extract_recommendations_from_raw_response(
    raw_response: str,
) -> List[Dict[str, Any]]:
    """
    1) Tente un json.loads direct
    2) Sinon, cherche un bloc ```json ... ```
    3) Sinon fallback
    """
    # 1) Tentative de parse direct
    try:
        data = json.loads(raw_response)
        if isinstance(data, list):
            return data
    except Exception:
        pass

    # 2) Cherche un bloc ```json ... ```
    match = re.search(r"```json\s*([\s\S]+?)\s*```", raw_response, flags=re.IGNORECASE)
    if match:
        block = match.group(1)  # ce qu'il y a entre ```json et ```
        try:
            data2 = json.loads(block)
            if isinstance(data2, list):
                return data2
        except Exception:
            pass

    # 3) Fallback : impossible de parser => on renvoie un "Info"
    return [
        {
            "priority": "Info",
            "issue": "Impossible de parser le JSON",
            "recommendation": raw_response,
        }
    ]


# Exemple d’imports pour OpenAIClient et ShopifyBlogger
# from src.packages.bloggers.shopify_blogger import ShopifyBlogger
# from src.packages.utils.openai import OpenAIClient


@app.post("/technicalAudit", response_model=TechnicalAuditResponse)
def technical_audit(payload: TechnicalAuditRequest):
    """
    1) Récupère le HTML de l'article (depuis Shopify ou depuis le payload).
    2) Appelle OpenAI pour générer un rapport technique SEO (JSON).
    3) Retourne la liste de recommandations + le contenu d'origine (HTML).
    """
    article_html = ""

    # Récupération du contenu
    if payload.article_content:
        article_html = payload.article_content
    else:
        if not payload.store or not payload.token or not payload.blog_id:
            raise HTTPException(
                status_code=400,
                detail="Missing store/token/blogId or article_content in request",
            )
        blogger = ShopifyBlogger()
        blogger.shop_url = payload.store
        blogger.api_token = payload.token

        # Récupérer l'article via blog_id
        article_data = blogger.get_article(payload.blog_id)
        if not article_data or "body" not in article_data:
            raise HTTPException(status_code=404, detail="Article not found on Shopify")

        article_html = article_data["body"]

    # Appel OpenAI
    openai_client = OpenAIClient()
    prompt = (
        f"Tu es un expert SEO technique. Je te fournis un article HTML.\n\n"
        f"ARTICLE:\n{article_html}\n\n"
        f"Analyse-le du point de vue SEO/technique: microdonnées, structure HTML, meta tags, "
        f"optimisation performance, etc.\n"
        f"Retourne-moi IMPÉRATIVEMENT un JSON avec la liste des problèmes et améliorations possibles. "
        f"Par exemple, un tableau de type :\n"
        f"[\n"
        f"  {{ 'priority': 'High'|'Medium'|'Low', 'issue': '...', 'recommendation': '...' }},\n"
        f"  ...\n"
        f"]\n"
        f"Ne donne pas d'autre texte, juste le JSON."
    )
    raw_response = openai_client.call_api(
        api_type="text",
        model="o1-mini",
        prompt=prompt,
    )

    # On parse le JSON en utilisant la fonction utilitaire
    recommendations = extract_recommendations_from_raw_response(raw_response)

    # On renvoie un TechnicalAuditResponse => le front aura un array de recos direct
    return TechnicalAuditResponse(
        recommendations=recommendations, original_content=article_html
    )


@app.post("/applyTechnicalAudit", response_model=ApplyTechnicalAuditResponse)
def apply_technical_audit(payload: ApplyTechnicalAuditRequest):
    """
    Reçoit:
      - Le contenu original
      - Le rapport d'audit (liste de problèmes/recommandations)
    Demande à OpenAI de corriger l'article selon ces recommandations
    Retourne le HTML corrigé.
    """
    if not payload.original_content.strip():
        raise HTTPException(status_code=400, detail="Missing original_content")

    # On prépare le texte des recos dans un format un peu plus "lisible" pour GPT
    report_text = "\n".join(
        f"- Priority={item.get('priority')}, Issue='{item.get('issue')}', Recommendation='{item.get('recommendation')}'"
        for item in payload.audit_report
    )

    openai_client = OpenAIClient()
    fix_prompt = (
        f"Voici un article HTML:\n"
        f"{payload.original_content}\n\n"
        f"Voici un rapport technique de recommandations:\n"
        f"{report_text}\n\n"
        f"Applique toutes ces recommandations sur l'article. "
        f"Retourne le HTML final corrigé, sans explication supplémentaire."
    )

    try:
        updated_html = openai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=fix_prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return ApplyTechnicalAuditResponse(updated_content=updated_html)


class WebAuditRequest(BaseModel):
    url: str


@app.post("/webAudit", response_model=TechnicalAuditResponse)
def web_audit(payload: WebAuditRequest):
    website_url = payload.url.strip()

    print(website_url)
    # 1) Scraping via httpx
    try:
        resp = httpx.get(website_url, timeout=10)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=400, detail=f"Cannot fetch URL, status {resp.status_code}"
            )
        raw_html = resp.text
        print(raw_html)
    except RequestError as e:
        raise HTTPException(
            status_code=500, detail=f"Error scraping URL via httpx: {str(e)}"
        )

    # 2) Appel OpenAI
    openai_client = OpenAIClient()
    prompt = (
        f"Tu es un expert SEO technique. Je te fournis le code HTML d'un site web.\n\n"
        f"HTML:\n{raw_html}\n\n"
        f"Analyse-le du point de vue SEO/technique (microdonnées, structure, meta tags...).\n"
        f"Retourne-moi IMPÉRATIVEMENT un JSON sous forme de tableau, par ex:\n"
        f"[\n"
        f"  {{ 'priority': 'High'|'Medium'|'Low', 'issue': '...', 'recommendation': '...' }},\n"
        f"  ...\n"
        f"]\n"
        f"Ne donne pas d'autres explications, juste le JSON pur."
    )

    raw_response = openai_client.call_api(
        api_type="text",
        model="o1-mini",
        prompt=prompt,
    )

    recommendations = extract_recommendations_from_raw_response(raw_response)
    return TechnicalAuditResponse(
        recommendations=recommendations, original_content=raw_html
    )


class WebAuditNoCheckRequest(BaseModel):
    url: str


@app.post("/webAuditNoCheck")
def web_audit_no_check(payload: WebAuditNoCheckRequest):
    """
    1) On accepte TOUTE forme d'URL (même "brod-ai.com" sans http).
    2) On essaie d'ajouter "https://" si besoin.
    3) On n'exige pas code 200 (on laisse la requête se faire).
    4) On fait l'appel OpenAI pour un audit technique.
    5) On renvoie un JSON `recommendations + original_content`.
    """

    # 1) Tenter de normaliser l'URL si pas de http
    website_url = payload.url.strip()
    if not (website_url.startswith("http://") or website_url.startswith("https://")):
        website_url = "https://" + website_url  # ou "http://" si tu préfères

    # 2) Scraping via httpx
    try:
        resp = httpx.get(website_url, timeout=10, follow_redirects=True)
        raw_html = resp.text
    except RequestError as e:
        # Au lieu de lever un 500, on renvoie un JSON "error"
        return {
            "success": False,
            "error": f"Error scraping URL via httpx: {str(e)}",
            "original_content": "",
            "recommendations": [],
        }

    # 3) Appel OpenAI
    openai_client = OpenAIClient()
    prompt = (
        f"Tu es un expert SEO technique. Je te fournis le code HTML d'un site web.\n\n"
        f"HTML:\n{raw_html}\n\n"
        f"Analyse-le du point de vue SEO/technique (microdonnées, structure, meta tags...).\n"
        f"Retourne-moi IMPÉRATIVEMENT un JSON sous forme de tableau, par ex:\n"
        f"[\n"
        f"  {{ 'priority': 'High'|'Medium'|'Low', 'issue': '...', 'recommendation': '...' }},\n"
        f"  ...\n"
        f"]\n"
        f"Ne donne pas d'autres explications, juste le JSON pur."
    )
    try:
        raw_response = openai_client.call_api(
            api_type="text",
            model="o1-mini",
            prompt=prompt,
        )
        recommendations = extract_recommendations_from_raw_response(raw_response)
        return {
            "success": True,
            "recommendations": recommendations,
            "original_content": raw_html,
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "original_content": raw_html,
            "recommendations": [],
        }


class ExtractKeyContentRequest(BaseModel):
    url: str


@app.post("/extractKeyContent")
def extract_key_content(payload: ExtractKeyContentRequest):
    """
    1) Scrape la page (sans impose la forme de l'URL).
    2) Parse avec BeautifulSoup pour extraire:
       - title, meta description,
       - h1, h2,
       - optionally first paragraphs, images alt, etc.
    3) Retourne ces infos en JSON (PAS d'appel GPT).
    """
    website_url = payload.url.strip()
    if not (website_url.startswith("http://") or website_url.startswith("https://")):
        website_url = "https://" + website_url

    try:
        resp = httpx.get(website_url, timeout=10, follow_redirects=True)
        raw_html = resp.text
    except RequestError as e:
        return {"success": False, "error": f"Error scraping URL: {str(e)}"}

    soup = BeautifulSoup(raw_html, "html.parser")

    # Title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # Meta description
    desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = (
        desc_tag["content"] if desc_tag and desc_tag.has_attr("content") else ""
    )

    # h1, h2
    h1_list = [h.get_text(" ", strip=True) for h in soup.find_all("h1")]
    h2_list = [h.get_text(" ", strip=True) for h in soup.find_all("h2")]

    # Optionnel: Extrait quelques paragraphes
    paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
    # On limite par exemple aux 10 premiers
    paragraphs = paragraphs[:10]

    return {
        "success": True,
        "title": title,
        "meta_description": meta_description,
        "h1": h1_list,
        "h2": h2_list,
        "paragraphs": paragraphs,
        # Tu peux aussi extraire les images, liens, etc.
    }


@app.post("/Keywords-to-topics")
def keywords_to_topics(payload: EvaluatedKeyword) -> Dict[str, str]:
    """
    TODO: call openai api to change the line from the 'report' of the endpoint /keyword_research

    then transform it into a JSON with a rephrased keyword (changing it to a topic) and a short descriptive sentence.

    e.g.
    Input:
      keyword="ecommerce AI", difficulty=40, traffic=1000
    Output:
      {
        "Application of AI in ecommerce":
        "This topic has 1000 searches per month and 40 difficulty, which make it really interesting"
      }
    """

    # 1) On prépare la ligne "keyword: ..., difficulty: X, traffic: Y"
    line_str = f"keyword: {payload.keyword}, difficulty: {payload.difficulty}, traffic: {payload.traffic}"

    # 2) On construit un prompt demandant un JSON (dict)
    #    avec "clé = mot‐clé reformulé" et "valeur = phrase descriptive".
    prompt = f"""
Transform the following line into a JSON dictionary, where the key is a short, rephrased topic name
and the value is a short descriptive sentence. 

Example:
If the line is "keyword: ecommerce AI, difficulty: 40, traffic: 1000", you might return:
{{
  "Application of AI in ecommerce": "This topic has 1000 searches per month and 40 difficulty, which make it really interesting."
}}

No extra text. Valid JSON only.

Line to transform:
{line_str}
    """.strip()

    # 3) Appel à l'API OpenAI via OpenAIClient
    try:
        openai_client = OpenAIClient()
        response_text = openai_client.call_api(
            api_type="text",
            model="gpt-4o",  # ou gpt-3.5-turbo etc.
            prompt=prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

    # 4) On parse la chaîne renvoyée, qui doit être un JSON
    try:
        rephrased_dict = json.loads(response_text)
        # On attend un dict du style:
        # {
        #   "Application of AI in ecommerce": "This topic has 1000 searches per month..."
        # }
        if not isinstance(rephrased_dict, dict):
            raise ValueError("Parsed JSON is not a dictionary.")

    except Exception:
        # En cas d’erreur de parsing, on renvoie une 500
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse GPT response as JSON: {response_text}",
        )

    return rephrased_dict


class DomainRequest(BaseModel):
    domain: str


@app.post("/generateKeywordsFromDomain")
def generate_keywords_from_domain(payload: DomainRequest):
    """

    TODO: call a function that do web scraping then generate 3 keywords using the KeywordResearcher

    returns a JSON 3 keywords and their metrics in a sentence
    """

    return


@app.post("/mock_generateKeywordsFromDomain")
def generate_keywords(payload: DomainRequest):
    domain = payload.domain
    if not domain:
        raise HTTPException(status_code=400, detail="Missing domain")

    # 1) Récupérer des infos sur le domain (facultatif) : on peut crawler le site, etc.
    # 2) Faire un prompt à OpenAI en lui donnant le domaine, ou un résumé du site
    # 3) Renvoyer 3 mots‐clés
    # => Pour l'exemple, je renvoie des mots‐clés en dur

    keywords = [
        "chaussures de randonnée",
        "conseils trekking",
        "réparation de chaussures",
    ]
    return keywords


@app.post("/summarize_site")
def summarize_site_content_for_demo(site_url: str) -> Dict[str, Dict[str, str] | int]:
    try:
        # 1) Extract h1/h2, meta_title, meta_description
        scraped_info = extract_website_info(site_url)

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

        return {"status": 200, "data": {"summary": summary}}
    except Exception as e:
        return {"status": 500, "data": {"error": str(e)}}
