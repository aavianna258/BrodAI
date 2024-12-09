import base64
import requests
import logging

class WordPressClient:
    def __init__(self, url, username, password):
        self.url = url.rstrip('/')
        self.auth = self._get_auth_header(username, password)

    def _get_auth_header(self, username, password):
        credentials = f"{username}:{password}"
        token = base64.b64encode(credentials.encode())
        return {'Authorization': f'Basic {token.decode("utf-8")}'}

    def upload_image(self, image_bytes, title):
        """
        Télécharge une image depuis une URL et l'upload sur WordPress.
        Retourne l'ID de l'image uploadée.
        """
        try:
            headers = self.auth.copy()
            headers.update({
                'Content-Disposition': f'attachment; filename={title}.png',
                'Content-Type': 'image/webp'
            })
            response = requests.post(f"{self.url}/wp-json/wp/v2/media", headers=headers, data=image_bytes)
            response.raise_for_status()
            return response.json()['id']
        except Exception as e:
            logging.error(f"Erreur lors de l'upload de l'image: {str(e)}")
            raise e

    def create_post(self, title, content, featured_media=None):
        """
        Crée un nouvel article sur WordPress.
        """
        try:
            post = {
                'title': title,
                'content': content,
                'status': 'draft'
            }
            if featured_media:
                post['featured_media'] = featured_media

            headers = self.auth.copy()
            headers.update({'Content-Type': 'application/json'})
            response = requests.post(f"{self.url}/wp-json/wp/v2/posts", headers=headers, json=post)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"Erreur lors de la création de l'article: {str(e)}")
            raise e
