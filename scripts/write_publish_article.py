import json
from typing import Dict, List, Optional
from src.packages.bloggers.shopify_blog_objects import Blog, BlogArticle
from src.packages.bloggers.shopify_blogger import ShopifyBlogger


def create_article_demo(blogger: ShopifyBlogger, blog_id='gid://shopify/Blog/114693013829') -> None:
    # Préparez les données pour votre article de démonstration
    article_demo: BlogArticle = {
        "title": "Article de démonstration",
        "author": "Auteur Demo",
        "handle": "demo-article",
        "body": "<p>Ceci est un corps d'article de démonstration avec un peu de HTML.</p>",
        "summary": "Ceci est le résumé de l'article de démonstration.",
        "is_published": True,  # ou False si vous ne souhaitez pas le publier immédiatement
        "publish_date": None,  # ex: "2025-01-01T00:00:00Z" si vous voulez forcer une date de publication
        "tags": ["demo", "shopify", "test"],
    }

    # Appelez la méthode `create_article` de votre classe ShopifyBlogger
    response = blogger.create_article(
        blog_id=blog_id,
        article=article_demo,
        publish=True  # Permet de publier directement l'article (ou False si vous voulez un brouillon)
    )

    # Affichez la réponse pour voir si tout a fonctionné
    print(json.dumps(response, indent=4, ensure_ascii=False))
