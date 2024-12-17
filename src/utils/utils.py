import json
import re
import logging
from typing import Dict, Any


def extract_json(text):

    first_brace = text.find('{')
    last_brace = text.rfind('}')

    if first_brace == -1 or last_brace == -1 or last_brace < first_brace:
        raise ValueError("Aucun JSON valide trouvé dans le texte fourni.")

    json_str = text[first_brace:last_brace + 1]
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Erreur de décodage JSON: {e.msg}", e.doc, e.pos)


def extract_keywords_json(text):
    """
    Extrait le bloc JSON du texte fourni et le convertit en un dictionnaire Python.

    Parameters:
        text (str): Le texte contenant le bloc JSON.

    Returns:
        dict: Un dictionnaire Python représentant les données JSON.
    """
    # Utiliser une expression régulière pour extraire le contenu entre ```json et ```
    pattern = r'```json\s*(\{.*?\})\s*```'
    match = re.search(pattern, text, re.DOTALL)
    
    if not match:
        raise ValueError("Aucun bloc JSON trouvé dans le texte fourni.")
    
    json_like_str = match.group(1)
    
    # Remplacer les ensembles (sets) par des listes pour rendre la chaîne compatible avec JSON
    # Cela suppose que les ensembles ne contiennent que des chaînes de caractères
    # et qu'il n'y a pas de structures imbriquées complexes.
    def sets_to_lists(match):
        key = match.group(1)
        items = match.group(2).split(',')
        # Nettoyer les espaces et les guillemets
        items = [item.strip().strip('"').strip("'") for item in items]
        # Reconstruire une liste JSON
        items_json = ', '.join(f'"{item}"' for item in items)
        return f'"{key}": [{items_json}]'
    
    # Expression régulière pour identifier les clés avec des ensembles comme valeurs
    sets_pattern = r'"([^"]+)":\s*\{([^}]*)\}'
    json_fixed_str = re.sub(sets_pattern, sets_to_lists, json_like_str)
    
    try:
        # Charger la chaîne JSON corrigée en dictionnaire Python
        data = json.loads(json_fixed_str)
    except json.JSONDecodeError as e:
        raise ValueError("Erreur lors de l'analyse du JSON corrigé.") from e
    
    return data

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
