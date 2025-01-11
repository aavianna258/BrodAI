from typing import Any, Dict, List
from dotenv import load_dotenv
import os
import shopify
import json
from blog_article import BlogArticle


class ShopifyBlogger:
    def __init__(self) -> None:
        load_dotenv(".env")
        self.api_token = os.getenv("SHOPIFY_ACCESS_TOKEN")
        shopname = os.getenv("SHOPIFY_STORE_NAME")
        self.api_version = os.getenv("SHOPIFY_API_VERSION")
        self.shop_url = "%s.myshopify.com" % shopname

    def _open_session(self) -> shopify.Session:
        return shopify.Session.temp(self.shop_url, self.api_version, self.api_token)

    def _execute_command(self, query: str, variables: Dict | None = None) -> Any:
        with self._open_session():
            response = shopify.GraphQL().execute(query, variables)
            return json.loads(
                response
            )[
                "data"
            ]  # getting only the data part of the response (maybe cutting some metadata out)

    def get_shop_name(self) -> Any:
        query = "{ shop { name } }"
        return self._execute_command(query)

    def create_blog(self, title: str, comment: str) -> str:
        return "Not implemented yet"

    def create_article(self, blog_id: str, article: BlogArticle) -> Any:
        mutation = """ mutation CreateArticle($article: ArticleCreateInput!) {
            articleCreate(article: $article) {
                article {
                    id
                    title
                    author {
                        name
                    }
                    handle
                    body
                    summary
                    tags
                    image {
                        altText
                        originalSrc
                    }
                }
                userErrors {
                    code
                    field
                    message
                    }
                }
            }"""
        variables = {
            "article": {
                "blogId": blog_id,
                "title": article["title"],  # required field
                "author": {"name": article["author"]},  # required field
                "handle": article.get("handle"),
                "body": article.get("body"),
                "summary": article.get("summary"),
                "isPublished": article.get("is_published"),
                "publishDate": article.get("publish_date"),
                "tags": article.get("tags"),
                # "image": { "altText": "Alt text for the image", "url": "http://example.com/fake_image.jpg"}
            }
        }

        return self._execute_command(mutation, variables)

    def list_blogs_and_articles(self) -> Any:
        query = """{
            blogs(first: 10) {
                nodes {
                    id
                    title
                    articles(first: 10) {
                        nodes {
                            body
                            title
                            summary
                            isPublished
                            author {
                                name
                            }
                            handle
                        }
                    }
                }
            }
        }"""
        response = self._execute_command(query)
        articles: Dict[str, List[Dict[str, str]]] = {}
        for blog in response["blogs"]["nodes"]:
            articles[blog["id"]] = []
            for article in blog["articles"]["nodes"]:
                articles[blog["id"]] = article
        return articles


blogger = ShopifyBlogger()
blog_id = "gid://shopify/Blog/89840976044"
articles = blogger.list_blogs_and_articles()
print(articles)
article = BlogArticle(
    {
        "blogId": "gid://shopify/Blog/389767568",
        "title": "New Article Title",
        "author": "Test User",
        "handle": "new-article-title",
        "body": "This is the content of the article.",
        "summary": "This is a summary of the article.",
        "is_published": True,
        "tags": ["Tag1", "Tag2"],
    }
)
# blogger.create_article(blog_id, article)
