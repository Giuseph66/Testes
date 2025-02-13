import cloudscraper

scraper = cloudscraper.create_scraper()  # Cria o scraper para bypass do Cloudflare

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

url = "https://auth.openai.com/authorize?audience=https%3A%2F%2Fapi.openai.com%2Fv1&client_id=TdJIcbe16WoTHtN95nyywh5E4yOo6ItG&country_code=BR&device_id=5d52c006-e7b1-47d7-a2d7-ac05bd2090d7&ext-oai-did=5d52c006-e7b1-47d7-a2d7-ac05bd2090d7&prompt=login&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&response_type=code&scope=openid+email+profile+offline_access+model.request+model.read+organization.read+organization.write&screen_hint=login&state=VHhUQir-J2JXshQLIKpQxQvFP6zLUXp45E43itRYLwo&flow=treatment"

response = scraper.get(url,headers=headers)

print(response.status_code)
print(response.text)  # Conteúdo HTML da página
