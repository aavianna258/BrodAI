from typing import Any, Dict
from urllib.request import urlopen
from lxml import html
from lxml.doctestcompare import LHTMLOutputChecker


class WebpageScrapper:
    def __init__(self, url: str, **kwargs: dict) -> None:
        """
        Initializes the WebpageScrapper with a URL and optional HTML parser arguments.

        Args:
            url (str): The URL of the webpage to scrape.
            **kwargs (dict): Optional keyword arguments for the HTML parser.
        """
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        self.url = url
        page = urlopen(self.url)
        if len(kwargs) > 0:
            custom_parser = html.HTMLParser(encoding="utf-8", **kwargs)
        else:
            custom_parser = html.HTMLParser(
                encoding="utf-8",
                remove_blank_text=False,
                remove_comments=False,
                remove_pis=False,
                strip_cdata=False,
                recover=True,
            )
        self.html_doc_tree = html.parse(page, parser=custom_parser)
        self.html_doc_root = self.html_doc_tree.getroot()

    def open_html_in_browser(self) -> None:
        """
        Opens the parsed HTML document in a web browser.
        """
        html.open_in_browser(self.html_doc_tree)

    def get_html_tree(self) -> Any:
        """
        Returns the parsed HTML tree.

        Returns:
            Any: The parsed HTML tree.
        """
        return self.html_doc_tree

    def compare_page_to_html(self, html_doc_root: html.HtmlElement) -> bool:
        """
        Compares the current HTML document to another HTML document.

        Args:
            html_doc_root (html.HtmlElement): The root element of the HTML document to compare against.

        Returns:
            bool: True if the documents are the same, False otherwise.
        """
        comparer = LHTMLOutputChecker()
        comparison_result = bool(
            comparer.compare_docs(self.html_doc_tree.getroot(), html_doc_root)
        )
        return comparison_result

    def extract_website_info(self) -> Dict[str, Any]:
        """
        Extracts website information from the HTML document.

        Returns:
            dict: A dictionary containing the following keys:
                - title: The text content of the <title> element.
                - meta_description: The content attribute of the <meta name="description"> element.
                - h1_texts: A list of text contents of all <h1> elements.
                - h2_texts: A list of text contents of all <h2> elements.
        """
        info = {}

        # Extract <title>
        title_elements = self.html_doc_root.xpath('//title/text()')
        info["title"] = title_elements[0].strip() if title_elements else ""

        # Extract <meta name="description">
        meta_desc_elements = self.html_doc_root.xpath('//meta[@name="description"]/@content')
        info["meta_description"] = meta_desc_elements[0].strip() if meta_desc_elements else ""

        # Extract all <h1> texts
        h1_elements = self.html_doc_root.xpath('//h1//text()')
        h1_texts = [text.strip() for text in h1_elements if text.strip()]
        info["h1_texts"] = h1_texts

        # Extract all <h2> texts
        h2_elements = self.html_doc_root.xpath('//h2//text()')
        h2_texts = [text.strip() for text in h2_elements if text.strip()]
        info["h2_texts"] = h2_texts

        return info

    def get_url_content(self) -> str:
        """
        Returns the HTML content of the URL as a string.

        Returns:
            str: The HTML content of the URL.
        """
        # Convert the parsed HTML document back to a string.
        html_string = html.tostring(self.html_doc_root, encoding="unicode", method="html")
        return html_string
