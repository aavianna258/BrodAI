from pathlib import Path
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
import os
import shopify
import json
from src.packages.bloggers.shopify_blog_objects import Blog, BlogArticle


class ShopifyBlogger:
    def __init__(self, client_name: Optional[str] = None) -> None:
        load_dotenv(".env")
        if client_name is not None:
            print(f"Using Shopify client: {client_name}")
            self.api_token = os.getenv(client_name + "_SHOPIFY_ACCESS_TOKEN")
            self.shop_url = os.getenv(client_name + "_SHOPIFY_STORE_URL")
            if self.api_token is None or self.shop_url is None:
                raise Exception(
                    f"Client {client_name} not found in .env file. Please check your .env file."
                )
        else:
            self.api_token = os.getenv("SHOPIFY_ACCESS_TOKEN")
            self.shop_url = os.getenv("SHOPIFY_STORE_URL")
        self.api_version = os.getenv("SHOPIFY_API_VERSION")
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
            # print("------------\nAPI RESPONSE\n------------\n", json.dumps(res_dict, indent=4))

            try:
                if response.get("errors"):
                    print(response["errors"])
                    raise Exception("Error executing command {operation_name}.")
                else:
                    return dict(res_dict["data"])
            except KeyError:
                raise ExceptionGroup(
                    "Error with Shopify API request.",
                    [
                        Exception(json.dumps(error, indent=4))
                        for error in res_dict["errors"]
                    ],
                )

    def get_shop_name(self) -> Dict[str, Any]:
        return self._execute_command(operation_name="GetShopName")

    def create_blog(self, blog: Blog) -> Dict[str, Any]:
        variables = {
            "blog": {
                "title": blog["title"],
                "handle": blog.get("handle"),
                "templateSuffix": blog.get("templateSuffix"),
                "commentPolicy": blog.get("commentPolicy") or "CLOSED",
            }
        }
        response = self._execute_command(
            operation_name="CreateBlog", variables=variables
        )
        print(f"Blog {response['blogCreate']['blog']['title']} created.")
        return dict(response["blogCreate"]["blog"])

    def delete_blog(self, blog_id: str) -> Dict[str, Any]:
        variables = {"id": blog_id}
        return self._execute_command(operation_name="DeleteBlog", variables=variables)

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
                "image": article.get("image"),
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
        variables = {"id": article_id}
        return self._execute_command(operation_name="GetArticle", variables=variables)

    def get_blog(self, blog_id: str) -> Dict[str, Any]:
        variables = {"id": blog_id}
        return self._execute_command(operation_name="GetBlog", variables=variables)

    def update_article(
        self, article_id: str, fields_to_update: Dict[str, str]
    ) -> Dict[str, Any]:
        variables = {
            "id": article_id,
            "article": {
                "title": fields_to_update["title"],
                "author": {"name": fields_to_update["author"]},
                "handle": fields_to_update.get("handle"),
                "body": fields_to_update.get("body"),
                "summary": fields_to_update.get("summary"),
                "isPublished": fields_to_update.get("is_published"),
                "tags": fields_to_update.get("tags"),
            },
        }
        return self._execute_command(
            operation_name="UpdateArticle", variables=variables
        )

    def publish_article(self, article_id: str) -> Dict[str, Any]:
        vars = {"id": article_id}
        return self._execute_command(operation_name="PublishArticle", variables=vars)

    def list_blogs_and_articles(self, n_articles: Optional[int] = 10) -> Dict[str, Any]:
        variables = {"nArticles": n_articles}
        response = self._execute_command(
            operation_name="ListBlogsAndArticles", variables=variables
        )
        return response

    def create_articles_from_files(
        self, blog_id: str, articles_filepaths: List[Dict[str, str]]
    ) -> None:
        """
        Creates articles from files.
        Input: List of dictionaries with keys "info" and "body" containing the filepaths of the article info.json and body.html files.
        """
        for filepath in articles_filepaths:
            with open(filepath["info"], "r") as info_file:
                article = dict(json.load(info_file))
                with open(filepath["body"], "r") as body_file:
                    article["body"] = body_file.read()
                    self.create_article(
                        blog_id=blog_id,
                        article=BlogArticle(**article),  # type: ignore[typeddict-item]
                        publish=True,
                    )
                    print(f"Article {article['title']} created on blog {blog_id}.")

    def update_articles_bodies_from_files(
        self, articles_filepaths: List[Dict[str, str]]
    ) -> None:
        """
        Updates the body of articles from files.
        Input: List of dictionaries with keys "info" and "body" containing the filepaths of the article info.json and body.html files.
        """
        for filepath in articles_filepaths:
            with open(filepath["info"], "r") as info_file:
                article_info = dict(json.load(info_file))
                with open(filepath["body"], "r") as body_file:
                    fields_to_update = {"body": body_file.read()}
                    self.update_article(
                        article_id=article_info["id"], fields_to_update=fields_to_update
                    )
                    print(
                        f"Article's body successfully updated. ID: {article_info['id']}, Handle: {article_info ["handle"]} ."
                    )
