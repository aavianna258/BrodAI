from typing import Optional
from src.packages.bloggers.shopify_blogger import ShopifyBlogger


def update_RTS_articles(client_name: Optional[str]) -> None:
    blogger = ShopifyBlogger(client_name)
    articles_filepaths = [
        {
            "info": "article_files/RTS_CABINETS/23-01-2025/hotel-bathroom-cabinets/article_data.json",
            "body": "article_files/RTS_CABINETS/23-01-2025/hotel-bathroom-cabinets/hotel-bathroom-cabinets.html",
        },
        {
            "info": "article_files/RTS_CABINETS/23-01-2025/how-to-modify-rta-cabinets/article_data.json",
            "body": "article_files/RTS_CABINETS/23-01-2025/how-to-modify-rta-cabinets/how-to-modify-rta-cabinets.html",
        },
        {
            "info": "article_files/RTS_CABINETS/23-01-2025/kitchen-cabinets-for-rental-property/article_data.json",
            "body": "article_files/RTS_CABINETS/23-01-2025/kitchen-cabinets-for-rental-property/kitchen-cabinets-for-rental-property.html",
        },
    ]

    blogger.update_articles_bodies_from_files(articles_filepaths)


client_name = "RTSCABINETS"
update_RTS_articles(client_name)
