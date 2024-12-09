import os
import openai
import logging
from dotenv import load_dotenv
from PIL import Image
import io
import requests

# Charger les variables d'environnement depuis .env
load_dotenv(r'C:\Users\aavia\GitProjects\For_artur\.env')

client=openai.OpenAI(api_key = os.getenv('OPENAI_API_KEY'))

def generate_article(prompt, keyword,links_html):
    """
    Génère un article en utilisant l'API OpenAI.
    """
    full_prompt = f"""Mots-clé: {keyword}\n En tant que SEO Expert, pour le mot
    clé génère un article avec le format JSON avec 'title' et 'content'. 
    Je veux un réponse avec le JSON seulement sans texte supplémentaire ou autre charactères spéciaux. 
    \n cette article il doit y'avoir un maillage externes en renvoyant vers ces links 
    d'une manière naturelle en essayant de les insérer directement dans le contenu de l'article: {links_html}. 
    L'article doit suivre toutes les consignes suivantes :
    {prompt}"""
    try:
        response = client.chat.completions.create(
            model="o1-mini",
            messages=[
                {"role": "user", "content": full_prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Erreur lors de la génération de l'article: {str(e)}")
        raise e

def generate_image(keyword):
    """
    Génère une image en utilisant l'API OpenAI.
    """
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=f"generate une image illustratrative sur le mot-clé {keyword}",
            n=1,
            size="1024x1024"
        )
        image_url = response.data[0].url
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        image = Image.open(io.BytesIO(image_response.content))

        # Convertir en WebP
        webp_bytes = io.BytesIO()
        image.save(webp_bytes, format='WEBP')
        webp_bytes.seek(0)

        return webp_bytes, f"{keyword}.webp"
    
    except Exception as e:
        logging.error(f"Erreur lors de la génération de l'image: {str(e)}")
        raise e

def generate_related_keywords(keyword: str, keywords : list ,top_n: int = 5) -> list:
    """
    Génère une liste de mots-clés liés en utilisant l'API OpenAI.
    """
    prompt = (
        f"Je vais te donner un mot-clé : '{keyword}'. "
        f"""Peux-tu sélectionner les {top_n} meilleurs mots-clés les plus proches de ce mot-clé à partir de cette
        liste de mots-clé : {keywords}.
        pour optimiser le SEO interne ? """
        f"Retourne-les sous forme de liste, séparés par des virgules."
    )
    try:
        response = openai.Completion.create(
            model="gpt-4o",  # Remplacez par le nom réel du nouveau modèle
            prompt=prompt,
            max_tokens=100,
            n=1,
            stop=None,
            temperature=0.7
        )
        related_keywords_text = response.choices[0].text.strip()
        # Supposons que le modèle retourne une liste séparée par des virgules
        related_keywords = [kw.strip() for kw in related_keywords_text.split(',')[:top_n]]
        logging.debug(f"Mots-clés liés pour '{keyword}': {related_keywords}")
        return related_keywords
    except Exception as e:
        logging.error(f"Erreur lors de la génération des mots-clés liés pour '{keyword}': {str(e)}")
        raise e