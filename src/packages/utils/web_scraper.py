# src/packages/utils/web_scraper.py

import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional

def extract_website_info(url: str) -> Dict[str, any]:
    """
    Fetches the HTML of the given URL and extracts:
      - <title>
      - <meta name="description" ...>
      - all <h1> and <h2> texts
    Returns a dictionary with these details.
    """
    # Ensure the URL has a scheme (http or https) - minimal check:
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url  # you can default to https or http

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        # If there's an error fetching the URL, raise or handle it
        raise ValueError(f"Failed to fetch {url}: {e}")

    soup = BeautifulSoup(response.text, "html.parser")

    # 1) Extract the <title>
    title_tag = soup.find("title")
    meta_title = title_tag.get_text(strip=True) if title_tag else ""

    # 2) Extract the <meta name="description">
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = (
        meta_desc_tag["content"].strip() if meta_desc_tag and meta_desc_tag.get("content") else ""
    )

    # 3) Extract all <h1> tags
    h1_tags = soup.find_all("h1")
    h1_texts = [h1.get_text(strip=True) for h1 in h1_tags]

    # 4) Extract all <h2> tags
    h2_tags = soup.find_all("h2")
    h2_texts = [h2.get_text(strip=True) for h2 in h2_tags]

    return {
        "meta_title": meta_title,
        "meta_description": meta_description,
        "h1_list": h1_texts,
        "h2_list": h2_texts,
    }
