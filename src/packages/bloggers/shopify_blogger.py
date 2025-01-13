from pathlib import Path
from typing import Any, Dict, List, Optional
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
        self.query_doc = Path(
            "./src/packages/bloggers/blog_queries.graphql"
        ).read_text()

    def _open_session(self) -> shopify.Session:
        return shopify.Session.temp(self.shop_url, self.api_version, self.api_token)

    def _execute_command(
        self,
        operation_name: Optional[str] = None,
        variables: Optional[Dict] = None,
        query: Optional[str] = None,
    ) -> Dict[str, Any]:
        with self._open_session():
            if query is None:
                query = self.query_doc
            response = shopify.GraphQL().execute(query, variables, operation_name)
            res_dict = json.loads(response)

            # print response for debugging
            print(json.dumps(res_dict, indent=4))

            # TODO: implement error handling, not the case here because getting only the data part
            return dict(res_dict["data"])

    def get_shop_name(self) -> Dict[str, Any]:
        return self._execute_command(operation_name="GetShopName")

    def create_blog(self, title: str, comment: str) -> str:
        return "Not implemented yet"

    def create_article(
        self, blog_id: str, article: BlogArticle, publish: Optional[bool] = False
    ) -> Dict[str, Any]:
        variables = {
            "article": {
                "blogId": blog_id,
                "title": article["title"],  # required field
                "author": {"name": article["author"]},  # required field
                "handle": article.get("handle"),
                "body": article.get("body"),
                "summary": article.get("summary"),
                "isPublished": article.get("is_published")
                or publish,  # if not provided, use publish parameter
                "publishDate": article.get("publish_date"),
                "tags": article.get("tags"),
                # "image": { "altText": "Alt text for the image", "url": "http://example.com/fake_image.jpg"}
            }
        }
        return self._execute_command(
            operation_name="CreateArticle", variables=variables
        )

    def list_blogs(self) -> Dict[str, Any]:
        return self._execute_command(operation_name="ListBlogs")

    def list_articles(self, blog_id: str) -> Dict[str, Any]:
        variables = {"blogId": blog_id}
        return self._execute_command(operation_name="ListArticles", variables=variables)

    def get_article(self, article_id: str) -> Dict[str, Any]:
        variables = {"articleId": article_id}
        return self._execute_command(operation_name="GetArticle", variables=variables)

    def update_article(self, article_id: str, article: BlogArticle) -> Dict[str, Any]:
        variables = {
            "id": article_id,
            "input": {
                "title": article["title"],
                "author": {"name": article["author"]},
                "handle": article.get("handle"),
                "body": article.get("body"),
                "summary": article.get("summary"),
                "isPublished": article.get("is_published"),
                "tags": article.get("tags"),
            },
        }
        return self._execute_command(
            operation_name="UpdateArticle", variables=variables
        )

    def publish_article(self, article_id: str) -> Dict[str, Any]:
        variables = {"id": article_id, "isPublished": True}
        return self._execute_command(
            operation_name="UpdateArticle", variables=variables
        )

    def list_blogs_and_articles(self, n_articles: Optional[int] = 10) -> Dict[str, Any]:
        variables = {"nArticles": n_articles}
        response = self._execute_command(
            operation_name="ListBlogsAndArticles", variables=variables
        )
        articles: Dict[str, List[Dict[str, str]]] = {}
        for blog in response["blogs"]["nodes"]:
            articles[blog["id"]] = []
            for article in blog["articles"]["nodes"]:
                articles[blog["id"]] = article
        return articles


def test_list_blogs_and_articles() -> None:
    blogger = ShopifyBlogger()
    articles = blogger.list_blogs_and_articles()
    print(json.dumps(articles, indent=4))


def test_create_article() -> None:
    blogger = ShopifyBlogger()
    blog_id = "gid://shopify/Blog/89840976044"
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
    blogger.create_article(blog_id, article)


def test_list_blogs() -> None:
    blogger = ShopifyBlogger()
    blogs = blogger.list_blogs()
    print(blogs)


def test_list_articles() -> None:
    blogger = ShopifyBlogger()
    blog_id = "gid://shopify/Blog/89840976044"
    articles = blogger.list_articles(blog_id)
    print(json.dumps(articles, indent=4))


def test_get_article() -> None:
    blogger = ShopifyBlogger()
    article_id = "gid://shopify/Article/1234567890"
    article = blogger.get_article(article_id)
    print(article)


def test_update_article() -> None:
    blogger = ShopifyBlogger()
    article_id = "gid://shopify/Article/1234567890"
    article = BlogArticle(
        {
            "title": "Updated Article Title",
            "author": "Updated Author",
            "handle": "updated-article-title",
            "body": "This is the updated content of the article.",
            "summary": "This is an updated summary of the article.",
            "is_published": True,
            "tags": ["UpdatedTag1", "UpdatedTag2"],
        }
    )
    updated_article = blogger.update_article(article_id, article)
    print(updated_article)


def test_publish_article() -> None:
    blogger = ShopifyBlogger()
    article_id = "gid://shopify/Article/1234567890"
    published_article = blogger.publish_article(article_id)
    print(published_article)


blogger = ShopifyBlogger()
print(blogger.get_shop_name())

# if __name__ == "__main__":
#     test_list_blogs_and_articles()
#     test_create_article()
#     test_list_blogs()
#     test_list_articles()
#     test_get_article()
#     test_update_article()
#     test_publish_article()
