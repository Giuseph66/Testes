import os
import pickle
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

# Caminho do arquivo de cookies
COOKIES_PATH = "cookies.pkl"

# Configura o caminho para o chromedriver
service = Service(r"C:\Minha_cria\chromedriver.exe")
driver = webdriver.Chrome(service=service)

# Navegue para o domínio principal antes de carregar os cookies
driver.get("https://www.mercadopago.com.br/home")

# Verifica se o arquivo de cookies existe
if os.path.exists(COOKIES_PATH):
    print("Cookies encontrados! Tentando carregá-los...")
    with open(COOKIES_PATH, "rb") as file:
        cookies = pickle.load(file)
        for cookie in cookies:
            if "domain" in cookie:
                cookie["domain"] = ".mercadopago.com.br"
            if "expiry" in cookie and not isinstance(cookie["expiry"], int):
                del cookie["expiry"]  # Remove expiração inválida
            try:
                driver.add_cookie(cookie)
                print(f"Cookie {cookie['name']} adicionado com sucesso!")
            except Exception as e:
                print(f"Erro ao adicionar cookie {cookie['name']}: {e}")
    print("Cookies carregados com sucesso!")
else:
    print("Cookies não encontrados. Faça login manualmente para salvar os cookies.")
    # Após login manual, salve os cookies
    input("Faça login e pressione Enter para continuar...")
    cookies = driver.get_cookies()
    with open(COOKIES_PATH, "wb") as file:
        pickle.dump(cookies, file)
        print("Cookies salvos com sucesso!")

# Atualiza a página para aplicar os cookies
driver.refresh()

# Verifica se o login foi mantido
if "login" in driver.current_url or "signin" in driver.page_source:
    print("Cookies inválidos ou sessão expirada. Faça login novamente.")
else:
    print("Login mantido com sucesso!")

print("Automação em execução...")
input("Pressione Enter para sair...")

driver.quit()
