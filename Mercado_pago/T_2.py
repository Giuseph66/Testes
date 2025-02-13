import os
import pickle
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

# Caminho do arquivo de cookies
COOKIES_PATH = "cookies.pkl"

if os.path.exists(COOKIES_PATH):
    print("Cookies encontrados! Tentando carregá-los...")
    with open(COOKIES_PATH, "rb") as file:
        cookies = pickle.load(file)
        for cookie in cookies:
            print(cookie)
            if "domain" in cookie:
                cookie["domain"] = ".mercadopago.com.br" 
