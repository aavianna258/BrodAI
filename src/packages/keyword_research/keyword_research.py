from typing import Any, List
from src.packages.config.prompts import Prompts
from src.packages.utils.other_utils import extract_keywords_json
from src.packages.utils.openai import OpenAIClient
from src.packages.utils.semrush import BrodAIKeyword, SemRushClient
import logging


class KeywordResearcher:
    def __init__(self, main_keyword: str, url: str = ""):
        self.main_keyword = main_keyword
        self.url = url

    def generate_related_keywords(
        self,
    ) -> Any:  # -> Dict[str, List[str]]: TODO Correct this
        """Generates a set of keywords related to the  set of keywords given."""
        llm_client = OpenAIClient()
        preset_prompts = Prompts().get_prompts()

        prompt = (
            f"keyword: {self.main_keyword}"
            + preset_prompts["generate_related_keywords"]
        )
        response_text = llm_client.call_api(
            api_type="text", model="gpt-4o", prompt=prompt
        )
        response_json = extract_keywords_json(response_text)

        return response_json

    def _compute_performance_score(self, volume: int, difficulty: float) -> float:
        """
        Scoring function pour un mot-clé, basée sur son volume de recherche et sa difficulté.
        - Score nul si le volume < 800.
        - Biais plus fort en faveur des faibles difficultés.
        """
        # Si le volume est inférieur à 800, score = 0
        if volume < 800:
            return 0.0

        # Exemple : on augmente la pénalisation de la difficulté en utilisant
        # une puissance plus grande (ici ^3) pour "renforcer" l’impact de la difficulté élevée.
        # Vous pouvez ajuster la formule (par ex. ^2, ^4, etc.) selon le degré de biais désiré.
        score = (volume**(0.3) / (0.0001 + (difficulty / 100) ** 3) / 10**3)

        return round(score, 2)


    def get_top_keywords(self) -> List[BrodAIKeyword]:
        semrush_client = SemRushClient()

        related_keywords = self.generate_related_keywords()

        list_related_keywords = []

        for group_of_keywords in related_keywords.values():
            # group_of_keywords is each list for each category (2-words,3-words ...), e.g. ["keyword1", "keyword2"]
            for kw in group_of_keywords:
                list_related_keywords.append(kw)

        candidates: List[BrodAIKeyword] = []
        for kw in list_related_keywords:
            try:
                metrics = semrush_client.get_keyword_metrics(keyword=kw)
                volume = metrics["traffic"]
                difficulty = metrics["difficulty"]
                score = self._compute_performance_score(volume, difficulty)
                candidates.append(
                    BrodAIKeyword(
                        keyword=kw,
                        traffic=volume,
                        difficulty=difficulty,
                        performance_score=score,
                    )
                )
            except Exception as e:
                logging.warning(f"Could not get metrics for keyword '{kw}': {e}")

        candidates_sorted = sorted(
            candidates, key=lambda x: x["performance_score"], reverse=True
        )

        return candidates_sorted[:10]

    def LLM_abstract_ranking(self) -> List[BrodAIKeyword]:
        """TODO: From a list of all the related keywords we ask the LLM to find the best 10 keywords
        to target based on the scoring and also how the keywords are relevant to the main keyword

        the performance scoring is not that relevant because it doesn't take into account the proximity
        between the generated keywords and the main keyword"""

        keyword1 = BrodAIKeyword(
            keyword="kw1",
            traffic=0,
            difficulty=0,
            performance_score=12,
        )
        candidates_sorted: List[BrodAIKeyword] = [keyword1] * 10
        return candidates_sorted
