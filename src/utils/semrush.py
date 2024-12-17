import io
import pandas as pd
import requests
from typing import Dict, Any, Optional
import os


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

    def get_domain_report(
        self,
        report_type: str,
        domain: str,
        region: Optional[str] = None,
        expect_csv: Optional[bool] = True,
        **kwargs,
    ) -> pd.DataFrame | requests.Response:
        """
        Sends API request and gets a SemRush a report for a given domain by specifying the report type.

        :param report_type: The type of report to fetch (e.g., "domain_overview", "domain_organic", "domain_adwords").
        :param domain: The domain to analyze (e.g., "example.com").
        :param region: The database region (e.g.: fr, us, ...). If no value is given, the report will evaluate all regions.
        :param expect_csv: Indicate if the API response will be in raw CSV text.
        :param kwargs: Additional query parameters specific to the report type.

        :return: A pandas DataFrame containing the report data.
        """
        endpoint = ""
        params = {
            "type": report_type,
            "domain": domain,
        }
        if region:
            params["database"] = region
        params.update(kwargs)  # Add any additional parameters provided by the user
        response = self._make_request(endpoint, params)
        return self._process_api_response(response) if expect_csv else response

    def get_keyword_report(
        self,
        report_type: str,
        phrase: str,
        region: Optional[str] = None,
        expect_csv: Optional[bool] = True,
        **kwargs,
    ) -> pd.DataFrame | requests.Response:
        """
        Sends API request and gets a SemRush a report for a given keyword by specifying the report type.

        :param report_type: The type of report to fetch (e.g., "phrase_this", "phrase_all", "phrase_these").
        :param phrase: A keyword or keyword expression you'd like to investigate.
        :param region: The database region (e.g.: fr, us, ...). If no value is given, the report will evaluate all regions.
        :param expect_csv: Indicate if the API response will be in raw CSV text.
        :param kwargs: Additional query parameters specific to the report type.

        :return: A pandas DataFrame containing the report data.
        """
        endpoint = ""
        params = {
            "type": report_type,
            "phrase": phrase,
        }
        if region:
            params["database"] = region
        params.update(kwargs)  # Add any additional parameters provided by the user
        response = self._make_request(endpoint, params)
        return self._process_api_response(response) if expect_csv else response

    def get_kwd_overview_for_region(
        self, phrase, region: Optional[str] = "fr"
    ) -> pd.DataFrame | requests.Response:
        """
        Sends API request and gets a SemRush a report for a given keyword by specifying the report type.

        :param phrase: A keyword or keyword expression you'd like to investigate.
        :param region: The database region (e.g.: fr, us, ...). If no value is given, the report will evaluate all regions.
        :param expect_csv: Indicate if the API response will be in raw CSV text.
        :param kwargs: Additional query parameters specific to the report type.

        :return: A pandas DataFrame containing the report data.
        """
        return self.get_keyword_report(
            report_type="phrase_this", phrase=phrase, region=region
        )
