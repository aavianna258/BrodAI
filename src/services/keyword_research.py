from typing import Dict, List, TypedDict
from src.config.prompts import Prompts
from src.utils.other_utils import extract_keywords_json
from src.utils.openai import OpenAIClient
from src.utils.semrush import SemRushClient
import logging



class BrodAIKeyword(TypedDict):
    keyword: str
    traffic : int
    difficulty : float
    intent : str
    performance_score: float


class KeywordResearcher:
    def __init__(self, main_keyword: str, url: str = ""):
        self.main_keyword = main_keyword
        self.url= url

    def generate_related_keywords(self) -> Dict[str, List[str]]:
        """Generates a set of keywords related to the  set of keywords given."""
        llm_client = OpenAIClient()
        preset_prompts = Prompts().get_prompts()

        prompt = f"keyword: {self.main_keyword}" + preset_prompts["generate_related_keywords"]
        response_text = llm_client.call_api(
            api_type="text", model="gpt-4o", prompt=prompt
        )
        response_json = extract_keywords_json(response_text)

        return response_json
        
    def _compute_performance_score(self, volume: int, difficulty: float) -> float :
        """ scoring function for keyword based on volume and difficulty
        just for test, we will improve it after
        """
        return round(volume / (0.1 + difficulty**2), 2)
    

    def get_top_keywords(self) -> List[BrodAIKeyword]:

        semrush_client= SemRushClient()

        related_keywords=self.generate_related_keywords()


        list_related_keywords = []

        for group_of_keywords in related_keywords.values():
            # group_of_keywords is each list for each category (2-words,3-words ...), e.g. ["keyword1", "keyword2"]
            for kw in group_of_keywords:
                list_related_keywords.append(kw)

        candidates: List[BrodAIKeyword]=[]
        for kw in list_related_keywords:
            try:
                metrics = semrush_client.get_keyword_report(keyword=kw)
                volume = metrics["traffic"]
                difficulty= metrics["difficulty"]
                score = self._compute_performance_score(volume,difficulty)
                candidates.append(BrodAIKeyword(
                    keyword=kw,
                    traffic=volume,
                    difficulty=difficulty,
                    performance_score=score
                ))
            except Exception as e:
                logging.warning(f"Could not get metrics for keyword '{kw}': {e}")

        candidates_sorted = sorted(candidates, key=lambda x: x["performance_score"], reverse=True)

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
            intent="Transactional",
            performance_score=12
            )
        candidates_sorted : List[BrodAIKeyword]=[keyword1]*10
        return candidates_sorted


