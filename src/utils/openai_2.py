import os
import openai
import logging
from dotenv import load_dotenv
from PIL import Image
import io
import requests
import json
from typing import Dict, Any, Optional
from src.utils.utils import extract_json,extract_keywords_json

load_dotenv()


class OpenAIClient:

    def __init__(self, 
                 prompts_file : str = "/Users/user/BrodAI/src/config/openai_prompts.json",
                 dotenv_path : Optional[str]=None, 
                 api_key : Optional[str]=None,
                 ):
        load_dotenv(dotenv_path or ".env")
        self.api_key=api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("An API key must be provided either directly or"
                "via the OPENAI_API_KEY environment variable.")
        self.client = openai.OpenAI(api_key=self.api_key)
        self.prompts=self._load_prompts(prompts_file)
    

    def _load_prompts(self, prompts_file:str) -> Dict[str, str]:

        if not os.path.exists(prompts_file):
            raise FileNotFoundError(f"Le fichier de prompts '{prompts_file}' n'existe pas.")
        
        try:
            with open(prompts_file, "r", encoding="utf-8") as f:
                prompts = json.load(f)
            logging.debug(f"Prompts chargés depuis '{prompts_file}'.")
            return prompts
        except json.JSONDecodeError as e:
            logging.error(f"Erreur de décodage JSON dans le fichier de prompts: {str(e)}")
            raise e
        except Exception as e:
            logging.error(f"Erreur lors du chargement des prompts: {str(e)}")
            raise e
        

    def _call_api(self, api_type: str, model: str, prompt:str,**kwargs) -> Any:

        try:
            if api_type == "text":
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    **kwargs
                )
                return response.choices[0].message.content.strip()

            elif api_type == "image":
                response = self.client.images.generate(
                    model=model,
                    prompt=prompt,
                    **kwargs
                )
                image_url=response.data[0].url
                return  image_url

            else:
                raise ValueError(f"Type d'API non supporté: {api_type}")
        except Exception as e:
            logging.error(f"Erreur lors de l'appel à l'API OpenAI ({api_type}): {str(e)}")
            raise e

    

    def generate_related_keywords(self, keyword: str) -> Dict:
        prompt= f"keyword: {keyword}" + self.prompts["generate_related_keywords"]

        response_text=self._call_api(api_type="text", model="gpt-4o", prompt=prompt)

        response_json=extract_keywords_json(response_text)

        return response_json




        