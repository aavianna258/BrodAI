import logging
from src.packages.keyword_research.keyword_research import KeywordResearcher
from src.packages.utils.openai import (
    OpenAIClient,
)  # Assurez-vous que le fichier contenant OpenAIClient est nommé openai_client.py ou ajustez l'importation

if __name__ == "__main__":
    # Configurer le logging
    logging.basicConfig(
        level=logging.ERROR, format="%(asctime)s - %(levelname)s - %(message)s"
    )

    # Initialiser le client OpenAI avec le chemin vers le fichier des prompts
    client = OpenAIClient(
        dotenv_path=".env",  # Assurez-vous que ce fichier existe et contient OPENAI_API_KEY
        api_key=None,  # Vous pouvez directement fournir la clé API ici si souhaité
    )

    # Définir un mot-clé pour générer des mots-clés liés
    keyword = "SEO"

    try:
        kwd_research = KeywordResearcher(keyword)
        related_keywords = kwd_research.generate_related_keywords()
        print("Mots-clés liés générés :", related_keywords)
    except ValueError as ve:
        print(f"Erreur de parsing JSON : {ve}")
    except Exception as e:
        print(f"Erreur lors de la génération des mots-clés liés : {e}")
