import json
import logging
import os
from typing import Dict, Optional


class Prompts:
    """Wrapper class to get the pre-written prompts to generate articles, images and keywords with OpenAI modules."""

    def __init__(self, prompts_file: Optional[str] = None) -> None:
        if not prompts_file:
            prompts_file = os.path.join(
                os.path.dirname(__file__), "openai_prompts.json"
            )
        else:
            if not os.path.exists(prompts_file):
                raise FileNotFoundError(
                    f"Le fichier de prompts '{prompts_file}' n'existe pas."
                )

        try:
            with open(prompts_file, "r", encoding="utf-8") as f:
                prompts = json.load(f)
            logging.debug(f"Prompts chargés depuis '{prompts_file}'.")
            self.prompts = dict(prompts)
        except json.JSONDecodeError as e:
            logging.error(
                f"Erreur de décodage JSON dans le fichier de prompts: {str(e)}"
            )
            raise e
        except Exception as e:
            logging.error(f"Erreur lors du chargement des prompts: {str(e)}")
            raise

    def get_prompts(self) -> Dict:
        return self.prompts
