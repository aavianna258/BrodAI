from scripts.publish_articles import create_blog_and_articles

client_name = None
response = create_blog_and_articles(client_name)
print(response)
