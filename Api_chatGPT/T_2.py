import requests

# Headers obtidos do navegador
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
}

login_url = "https://auth.openai.com/authorize?audience=https%3A%2F%2Fapi.openai.com%2Fv1&client_id=TdJIcbe16WoTHtN95nyywh5E4yOo6ItG&country_code=BR&device_id=5d52c006-e7b1-47d7-a2d7-ac05bd2090d7&ext-oai-did=5d52c006-e7b1-47d7-a2d7-ac05bd2090d7&prompt=login&redirect_uri=https%3A%2F%2Fchatgpt.com%2Fapi%2Fauth%2Fcallback%2Fopenai&response_type=code&scope=openid+email+profile+offline_access+model.request+model.read+organization.read+organization.write&screen_hint=login&state=VHhUQir-J2JXshQLIKpQxQvFP6zLUXp45E43itRYLwo&flow=treatment"

# Dados de login (verifique os campos no navegador)
login_data = {
    "email": "seu_usuario",
}

# Envia uma requisição POST para autenticar
login_response = requests.post(login_url, data=login_data)
print(login_response.text)
# Verifica o status
if login_response.status_code == 200:
    print("Login realizado com sucesso!")
    session_cookies = login_response.cookies  # Captura cookies da sessão
else:
    print(f"Erro no login: {login_response.status_code}")
