from typing import Optional, TypedDict


class Blog(TypedDict):
    title: str
    handle: Optional[str]
    templateSuffix: Optional[str]
    commentPolicy: str


class BlogArticle(TypedDict):
    title: str
    body: str
    summary: str
    is_published: bool
    publish_date: str
    tags: list[str]
    author: str
    handle: str
