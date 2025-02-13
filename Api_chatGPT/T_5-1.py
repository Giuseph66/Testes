import requests
import json

# Carregar cookies exportados (JSON do EditThisCookie)
with open("cookies.json", "r") as f:
    cookies = json.load(f)

# Converter cookies para o formato do requests
session_cookies = {cookie['name']: cookie['value'] for cookie in cookies}

# Fazer a requisição com os cookies carregados
url = "https://auth.openai.com"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=headers, cookies=session_cookies)

print("Status Code:", response.status_code)
print("Response Text:", response.text[:500])
