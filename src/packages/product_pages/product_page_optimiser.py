from typing import List


class ProductPageOptimiser:
    def __init__(self, content: str, target_keywords: List[str]):
        self.page_content = content
        self.target_keywords = target_keywords
        self.optimised_page_content = None

    def optimise_page_for_target_kwds(self) -> str:
        """TODO: Calls the OpenAI API and optimises the webpage for the target kwds"""
        return "<div>a random HTML page that should be optimised</div>"
