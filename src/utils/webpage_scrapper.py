from typing import Any
from urllib.request import urlopen
from lxml import html
from lxml.doctestcompare import (
    LHTMLOutputChecker,
)  # This is the class that will be used to compare HTML content


class WebpageScrapper:
    def __init__(self, url: str, **kwargs: dict) -> None:
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
        html.open_in_browser(self.html_doc_tree)

    def get_html_tree(self) -> Any:
        return self.html_doc_tree

    def compare_page_to_html(self, html_doc_root: html.HtmlElement) -> bool:
        comparer = LHTMLOutputChecker()
        comparison_result = bool(
            comparer.compare_docs(self.html_doc_tree.getroot(), html_doc_root)
        )
        return comparison_result

    def get_url_content(self) -> str:
        """Extracts the HTML content from the URL"""
        return ""


"""
About lxml.html.HTMLParser...

Available boolean keyword arguments:
- recover
    - try hard to parse through broken HTML (default: True)
- no_network         
    - prevent network access for related files (default: True)
- remove_blank_text  
    - discard empty text nodes that are ignorable (i.e. not actual text content)
- remove_comments   
    - discard comments
- remove_pis
    - discard processing instructions
- strip_cdata        
    - replace CDATA sections by normal text content (default: True)
- compact            
    - save memory for short text content (default: True)
- default_doctype    
    - add a default doctype even if it is not found in the HTML (default: True)
- collect_ids        
    - use a hash table of XML IDs for fast access (default: True)
- huge_tree          
    - disable security restrictions and support very deep trees
        and very long text content (only affects libxml2 2.7+)

Other keyword arguments:
- encoding 
    - override the document encoding
- target   
    - a parser target object that will receive the parse events
- schema   
    - an XMLSchema to validate against
    Note that you should avoid sharing parsers between threads 
    for performancereasons.
"""
