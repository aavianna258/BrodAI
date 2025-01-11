from typing import TypedDict


class BlogArticle(TypedDict):
    title: str
    body: str
    summary: str
    is_published: bool
    publish_date: str
    tags: list[str]
    author: str
    handle: str
