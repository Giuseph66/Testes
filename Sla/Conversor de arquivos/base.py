import base64
import time

ini=time.time()
caminho_arquivo = "inventario rogerio seg contador.pdf"

def arquivo_para_base(caminho_arquivo):
    with open(caminho_arquivo, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")

def base_para_arquivo(conteudo, caminho_saida):
    with open(caminho_saida, "wb") as file:
        file.write(base64.b64decode(conteudo))
        
conteudo=arquivo_para_base(caminho_arquivo)

print(f"tempo {time.time()-ini} tamanho {len(conteudo)}")
ini=time.time()

base_para_arquivo(conteudo, "out.pdf")

print(f"tempo {time.time()-ini}")

print(conteudo)