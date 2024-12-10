class ProductPageExtractor:
    def __init__(self, url):
        self.url: str = url
        self.content: str = None  # for now it is a string

    def get_url_content(self) -> str:
        """TODO: Extracts the HTML content from the URL"""
        return "<div>a random html page content</div>"
