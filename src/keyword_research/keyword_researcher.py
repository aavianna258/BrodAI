from typing import List, TypedDict


class SemRushKeyword(TypedDict):
    keyword: str
    performance_score: float
    traffic: int
    difficulty: str


class SemRushReport(TypedDict):
    url: str
    monthly_traffic: int
    top_keywords: List[SemRushKeyword]


class KeywordResearcher:
    def __init__(self, url):
        self.url = url
        self.current_top_keywords: List = list()

    def get_current_top_kwds(self):
        """TODO: Calls SemRush API and gets current top keywords"""
        # gets current top kwds if that has not been done yet
        if self.current_top_keywords is not []:
            # Get kwds
            kwd1 = SemRushKeyword(
                keyword="sweater",
                performance_score=50.5,
                traffic=10001,
                difficulty="easy",
            )  # TODO: remove, this is only a placeholder

            # Assemble and return output
            top_kwds = [kwd1]  # TODO: remove, this is only a placeholder
            self.current_top_keywords = top_kwds
            return top_kwds

        # top_keywords are already defined
        else:
            return self.current_top_keywords

    def generate_sem_rush_report(self) -> SemRushReport:
        """TODO: Calls relevant methods and creaters the SemRush report on the current state of the product page"""
        url = self.url
        top_kwds = self.research_best_keywords()
        report = SemRushReport(
            {"url": url, "monthly_traffic": 0, "top_keywords": top_kwds}
        )
        return report

    def research_best_keywords(self) -> List[SemRushKeyword]:
        """TODO: obtains the best keywords for the page"""
        # gets current top kwds if that has not been done yet
        top_kwds = self.get_current_top_kwds()

        # optimises top kwds with OpenAI API and SemRush API
        best_kwds: List[
            SemRushKeyword
        ] = top_kwds  # TODO: remove, this is only a placeholder

        return best_kwds
