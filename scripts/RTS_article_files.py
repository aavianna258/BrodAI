from typing import Optional
from src.packages.bloggers.shopify_blog_objects import Blog
from src.packages.bloggers.shopify_blogger import ShopifyBlogger


def create_RTS_blog_and_articles(client_name: Optional[str]) -> None:
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
    blog = Blog(
        title="RTS Cabinets Blog",
        commentPolicy="CLOSED",
        handle=None,
        templateSuffix=None,
    )
    created_blog = blogger.create_blog(blog)
    blogger.create_articles_from_files(created_blog["id"], articles_filepaths)


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
