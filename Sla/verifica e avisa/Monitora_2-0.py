from playwright.sync_api import sync_playwright
from win10toast import ToastNotifier
from playsound import playsound
import threading
import time
import os

def tocar_som():
    playsound(os.path.join(os.path.dirname(__file__), r"C:\Minha_cria\Monitora\Som.mp3"))

def notifica(mensagem):
    toaster = ToastNotifier()
    threading.Thread(target=tocar_som).start()
    toaster.show_toast(
        'Aviso !!!',
        mensagem,
        icon_path=os.path.join(os.path.dirname(__file__), r"C:\Minha_cria\Monitora\Icon_sistema.ico"),
        duration=1,
        threaded=False
    )

def verificar_navegador_aberto(page):
    try:
        if page.is_closed():
            return False
        page.evaluate("1")
        return True
    except Exception:
        return False

def monitorar_pagina():
    print('monitorando')
    with sync_playwright() as p:
        # Inicia o navegador (não headless para visualização)
        browser = p.chromium.launch(headless=False)    
        context = browser.new_context(permissions=["notifications"])    
        page = context.new_page()
        try:
            print('acessando login')
            page.goto("https://front.nortechat.com.br/#/login")
            time.sleep(2)
            
            # Preenche os campos de login
            page.fill("//input[@type='text']", "suporte02@nortesistema.com.br")
            page.fill("//input[@type='password']", "@Suporte02")
            
            print('interagindo com o slider')
            # Localiza o elemento do slider
            slider = page.query_selector(".q-slider__thumb")
            if slider:
                box = slider.bounding_box()
                if box:
                    # Calcula o ponto central do slider
                    x = box["x"] + box["width"] / 2
                    y = box["y"] + box["height"] / 2
                    # Simula o movimento de arrastar do slider (offset horizontal de 300 pixels)
                    page.mouse.move(x, y)
                    page.mouse.down()
                    page.mouse.move(x + 300, y)
                    page.mouse.up()
                    print('slider movido')
                else:
                    print('Não foi possível obter a posição do slider.')
            else:
                print('Slider não encontrado.')
            
            time.sleep(2)
            # Clica no botão de "Entrar"
            page.click("//span[contains(text(), 'Entrar')]")
            print('clicando em entrar')
            time.sleep(5)
            
            while True:
                mensagem = ""
                if verificar_navegador_aberto(page):
                    try:
                        # Localiza o elemento que contém o número de clientes
                        elemento = page.query_selector('//*[@id="q-app"]/div/div[1]/div/div/div/div[1]/aside/div/div[6]/div/div/div/div[2]/div[2]/div[3]')
                        if elemento:
                            texto = elemento.inner_text().strip()
                            valor = int(texto)
                            print(f"Valor atual de clientes é: {valor}")
                            if valor != 0:
                                mensagem = f'Alguém na fila de espera!\n\nTotal de clientes: {valor}'
                        else:
                            mensagem = 'Elemento não encontrado, tentando novamente...'
                    except Exception:
                        mensagem = 'Erro ao buscar valor, tentando novamente...'
                    
                    if mensagem != "":
                        notifica(mensagem)
                else:
                    notifica('Encerrando...')
                    break
                time.sleep(10)
        except Exception as e:
            print(f"Erro: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "0"
    monitorar_pagina()
