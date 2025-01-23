import json
from typing import Dict, List, Optional
from src.packages.bloggers.shopify_blog_objects import Blog, BlogArticle
from src.packages.bloggers.shopify_blogger import ShopifyBlogger


def create_blog(blogger: ShopifyBlogger, blog: Blog) -> Dict[str, str]:
    response = blogger.create_blog(blog)
    if response.get("errors"):
        print(response["errors"])
        raise Exception("Error creating blog.")

    print(f"Blog {response['blogCreate']['blog']['title']} created.")
    return dict(response["blogCreate"]["blog"])


def create_articles(
    blogger: ShopifyBlogger, blog_id: str, articles_filepaths: List[Dict[str, str]]
) -> None:
    for filepath in articles_filepaths:
        with open(filepath["info"], "r") as info_file:
            article = dict(json.load(info_file))
            with open(filepath["body"], "r") as body_file:
                article["body"] = body_file.read()
                response = blogger.create_article(
                    blog_id=blog_id,
                    article=BlogArticle(**article),  # type: ignore[typeddict-item]
                    publish=True,
                )
                print(f"Article {article['title']} created on blog {blog_id}.")
                print(response)


def create_blog_and_articles(client_name: Optional[str]) -> Dict[str, str]:
    blogger = ShopifyBlogger(client_name)
    articles_filepaths = [
        {
            "info": "articles/RTS_CABINETS/23-01-2025/hotel-bathroom-cabinets/article_data.json",
            "body": "articles/RTS_CABINETS/23-01-2025/hotel-bathroom-cabinets/hotel-bathroom-cabinets.html",
        },
        {
            "info": "articles/RTS_CABINETS/23-01-2025/how-to-modify-rta-cabinets/article_data.json",
            "body": "articles/RTS_CABINETS/23-01-2025/how-to-modify-rta-cabinets/how-to-modify-rta-cabinets.html",
        },
        {
            "info": "articles/RTS_CABINETS/23-01-2025/kitchen-cabinets-for-rental-property/article_data.json",
            "body": "articles/RTS_CABINETS/23-01-2025/kitchen-cabinets-for-rental-property/kitchen-cabinets-for-rental-property.html",
        },
    ]
    blog = Blog(
        title="RTS Cabinets Blog",
        commentPolicy="CLOSED",
        handle=None,
        templateSuffix=None,
    )
    created_blog = create_blog(blogger, blog)
    create_articles(blogger, created_blog["id"], articles_filepaths)
    return created_blog
