import os
import openai
import logging
from dotenv import load_dotenv
from typing import Any, Optional


class OpenAIClient:
    def __init__(
        self,
        dotenv_path: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        """Loads API key and pre-written prompts"""

        load_dotenv(dotenv_path or ".env")
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError(
                "An API key must be provided either directly or"
                "via the OPENAI_API_KEY environment variable."
            )
        self.client = openai.OpenAI(api_key=self.api_key)

    def call_api(self, api_type: str, model: str, prompt: str, **kwargs) -> Any:
        """Calls the OpenAI API to generate text or images."""

        try:
            if api_type == "text":
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    **kwargs,
                )
                return response.choices[0].message.content.strip()

            elif api_type == "image":
                response = self.client.images.generate(
                    model=model, prompt=prompt, **kwargs
                )
                image_url = response.data[0].url
                return image_url

            else:
                raise ValueError(f"Type d'API non supporté: {api_type}")
        except Exception as e:
            logging.error(
                f"Erreur lors de l'appel à l'API OpenAI ({api_type}): {str(e)}"
            )
            raise e
