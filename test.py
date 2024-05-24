from main import convert_to_api_url, os
from dotenv import load_dotenv

load_dotenv()

git_token = os.environ.get('GIT_TOKEN')
url = '''https://github.com/Ayush-20122/DALL-E-Image-Generator.git'''

print(convert_to_api_url(url))
print(git_token)