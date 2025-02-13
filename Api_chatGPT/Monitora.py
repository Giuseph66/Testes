from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver
from win10toast import ToastNotifier
from playsound import playsound
import threading
import time
import os

service = Service(os.path.join(os.path.dirname(__file__),r"C:\Minha_cria\Monitora\chromedriver.exe"))
print('chrome aberto')
driver = webdriver.Chrome(service=service)
print('driver configurado')
    

def tocar_som():
    playsound(os.path.join(os.path.dirname(__file__),r"C:\Minha_cria\Monitora\Som.mp3"))


def verificar_navegador_aberto(driver):
    try:
        driver.execute_script("return 1;")
        return True
    except WebDriverException:
        return False
    
def notifica(mensagem):
    toaster = ToastNotifier()
    threading.Thread(target=tocar_som).start()
    toaster.show_toast(
        'Aviso !!!',
        mensagem,
        os.path.join(os.path.dirname(__file__), r"C:\Minha_cria\Monitora\Icon_sistema.ico"),
        1,
        False
    )            

def monitorar_pagina():
    print('monitorando')
    try:
        print('acessando login')
        driver.get("https://front.nortechat.com.br/#/login")
        time.sleep(2)

        driver.find_element(By.XPATH, "//input[@type='text']").send_keys("suporte02@nortesistema.com.br")
        driver.find_element(By.XPATH, "//input[@type='password']").send_keys("@Suporte02")

        print('interagindo com o slider')
        slider_thumb = driver.find_element(By.CLASS_NAME, "q-slider__thumb")
        print('slider encontrado')
        actions = ActionChains(driver)
        actions.click_and_hold(slider_thumb).move_by_offset(300, 0).release().perform()  # Ajuste o offset horizontal (300)
        print('slider movido')

        time.sleep(2)

        botao_entrar = driver.find_element(By.XPATH, "//span[contains(text(), 'Entrar')]")
        botao_entrar.click()
        print('clicando em entrar')
        time.sleep(5)
        while True:
            mensagem=''
            if verificar_navegador_aberto(driver):
                try:
                    campo = driver.find_element(By.XPATH, '//*[@id="q-app"]/div/div[1]/div/div/div/div[1]/aside/div/div[6]/div/div/div/div[2]/div[2]/div[3]')
                    valor = int(campo.text.strip())

                    print(f"Valor atual de clientes é: {valor}")
                    if valor!=0:
                        mensagem = f'Alguem na fila de espera!\n\n Total de clientes: {valor}'
                except :
                    mensagem= f'Erro ao buscar valor, tentando novamente... '
                    
                if mensagem != '':
                    notifica(mensagem)
            else:
                notifica('Encerrando...')
                break
            time.sleep(10)

    except Exception as e:
        print(f"Erro: {e}")
    finally:
        driver.quit()

monitorar_pagina()
