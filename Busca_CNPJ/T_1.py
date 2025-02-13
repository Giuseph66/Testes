from playwright.sync_api import sync_playwright

def abrir_whatsapp(url, navegador, n):
    pagina = navegador.new_page()
    pagina.goto(url)
    pagina.wait_for_selector("canvas")
    pagina.wait_for_selector("div._akaz span svg")
    elemento = pagina.locator("canvas")
    elemento.screenshot(path=f"qr_code_completo{n}.png")
    print(f"QR Code {n} gerado com sucesso!")

if __name__ == "__main__":
    with sync_playwright() as p:
        print("Abrindo navegador 1")
        navegador_1 = p.chromium.launch(headless=False)
        print("Abrindo navegador 2")
        navegador_2 = p.chromium.launch(headless=False)
        print("Abrindo navegador 3")
        navegador_3 = p.chromium.launch(headless=False)
        abrir_whatsapp("https://web.whatsapp.com", navegador_1, '1')
        abrir_whatsapp("https://web.whatsapp.com", navegador_1, '2')
        abrir_whatsapp("https://web.whatsapp.com", navegador_1, '3')
        input("Pressione Enter para continuar...")
        navegador_1.close()
        navegador_2.close()
        navegador_3.close()
