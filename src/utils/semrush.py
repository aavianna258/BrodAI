import io
import pandas as pd
import requests
from typing import Dict, TypedDict, Any, Optional
import os


class BrodAIKeyword(TypedDict):
    keyword : str
    traffic: int
    difficulty: float

class SemRushClient:
    """
    A client class for interacting with the SEMrush Analytics API.
    """

    BASE_URL = "https://api.semrush.com"  # Update if the base URL differs

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the SEMrushClient with an API key. The key can be provided
        directly or through the SEMRUSH_API_KEY environment variable.

        :param api_key: Your SEMrush API key (optional).
        """
        self.api_key = api_key or os.getenv("SEMRUSH_API_KEY")
        if not self.api_key:
            raise ValueError(
                "An API key must be provided either directly or "
                "via the SEMRUSH_API_KEY environment variable."
            )

    def _make_request(
        self, endpoint: str, params: Dict[str, Any], max_results: Optional[int] = 10
    ) -> requests.Response:
        """
        Make a GET request to the SEMrush API.

        :param endpoint: The API endpoint (path)
        :param params: Query parameters for the request
        :return: The parsed JSON response
        """
        params["key"] = self.api_key  # Add the API key to the request parameters
        params["display_limit"] = max_results
        url = f"{self.BASE_URL}/{endpoint}"

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()  # Raise an HTTPError for bad responses
            return response
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error making request to SEMrush API: {e}")
        except ValueError:
            raise Exception("Failed to parse response as JSON.")

    def _process_api_response(self, response: requests.Response) -> pd.DataFrame:
        """
        The SemRush API returns reports in a CSV format but it doesn't indicate this in the response header (it appears as text/plain).
        This method processes the output properly.

        :return: a pandas DataFrame with the properly formatted report.
        """
        report_string = response.text.strip("\r")
        return pd.read_csv(io.StringIO(report_string), sep=";")

    def get_analytics_report(
        self,
        report_type: str,
        domain: str,
        region: str = "us",
        expect_csv: bool = True,
        **kwargs: str,
    ) -> pd.DataFrame | requests.Response:
        """
        Fetch any type of analytics report for a given domain by specifying the report type.

        :param report_type: The type of report to fetch (e.g., "domain_overview", "domain_organic", "domain_adwords").
        :param domain: The domain to analyze (e.g., "example.com").
        :param database: The database region (default: "us").
        :param kwargs: Additional query parameters specific to the report type.
        :return: A dictionary containing the report data.
        """
        endpoint = ""
        params = {
            "type": report_type,
            "domain": domain,
            "database": region,
        }
        params.update(kwargs)  # Add any additional parameters provided by the user
        response = self._make_request(endpoint, params)
        return self._process_api_response(response) if expect_csv else response

    def get_domain_report(self, domain: str) -> pd.DataFrame | requests.Response:
        return self.get_analytics_report("domain_rank", domain)
    

    def get_keyword_report(self, keyword: str) -> BrodAIKeyword:
        """
        Takes a keyword as an argument and returns the metrics for a given keyword.

        :param keyword: The keyword to analyze.
        :return: A dictionary containing keyword metrics.
        """
        endpoint=""
        params = {
            "type": "phrase_this",            # Type de rapport pour les mots-clés
            "phrase": keyword,                # Mot-clé à analyser
            "database": "us",                 # country database
            "export_columns": "Ph,Nq,Co"      # Export Columns
        }

        try:
            response = self._make_request(endpoint, params)

            df = self._process_api_response(response)

            if df.empty:
                raise ValueError(f"No data returned for keyword: {keyword}")

            # Extraire la première ligne des résultats

            row = df.iloc[0]

            # Construire le dictionnaire BrodAIKeyword
            keyword_data = BrodAIKeyword(
                keyword=row["Keyword"],
                traffic=int(row["Search Volume"]),
                difficulty=float(row["Competition"])
            )

            return keyword_data

        except Exception as e:
            # Vous pouvez ajouter un logging ici si nécessaire
            raise Exception(f"Failed to get keyword report for '{keyword}': {e}")
        


    def get_keyword_report_test(self, keyword: str) -> BrodAIKeyword:
        """
        Return fake data for testing so we don't call the real API.
        """
        return {
            "keyword": keyword,
            "traffic": 999,
            "difficulty": 0.1
        }
