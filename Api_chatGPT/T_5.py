from playwright.sync_api import sync_playwright

def acessar_site():
    with sync_playwright() as p:
        # Criar navegador com sessão persistente
        browser = p.chromium.launch_persistent_context(
            user_data_dir="session_data",  # Pasta para salvar a sessão
            headless=False  # Mostrar navegador para resolver CAPTCHA manualmente
        )
        
        # Abrir ou reutilizar uma página
        page = browser.pages[0] if browser.pages else browser.new_page()

        # Acessar o site
        page.goto("https://auth.openai.com")
        
        # Dar tempo para resolver CAPTCHA manualmente
        print("Resolva o CAPTCHA manualmente e pressione Enter...")
        input()  # Aguarda entrada do usuário
        
        # Verificar título da página para confirmar sucesso
        print(f"Título da página: {page.title()}")
        
        # Sessão será salva automaticamente no diretório "session_data"
        print("Sessão salva. Você pode reutilizá-la no próximo acesso.")
        browser.close()

acessar_site()
