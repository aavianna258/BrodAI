import json
from src.packages.bloggers.shopify_blogger import ShopifyBlogger

client_name = "BB_HOUSE"
blogger = ShopifyBlogger(client_name)
response = blogger.list_blogs()
print(json.dumps(response, indent=4))
