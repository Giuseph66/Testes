
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

# Configura o caminho para o chromedriver
service = Service(r"C:\Minha_cria\chromedriver.exe")
print('chrome aberto')

options = Options()
options.add_argument("--headless")  # Executar em segundo plano
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(service=service, options=options)

print('acessando login')
driver.get("https://auth.openai.com")
content = driver.page_source
print(content)

driver.quit()
