import json
import re
import logging

from dotenv import load_dotenv


def extract_json(text):
    """
    Extrait le JSON d'une chaîne de caractères.
    """
    try:
        json_str = re.search(r"\{.*\}", text, re.DOTALL).group()
        return json.loads(json_str)
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction du JSON: {str(e)}")
        raise e


def generate_slug(keyword):
    """
    Génère un slug à partir du mot-clé en le mettant en minuscules,
    en supprimant les caractères spéciaux et en remplaçant les espaces par des tirets.
    """
    # Mettre en minuscules
    slug = keyword.lower()
    # Supprimer les caractères spéciaux
    slug = re.sub(r"[^\w\s-]", "", slug)
    # Remplacer les espaces et les underscores par des tirets
    slug = re.sub(r"[\s_]+", "-", slug)
    return slug
