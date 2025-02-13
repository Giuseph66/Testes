import time

def arquivo_para_binario(caminho_arquivo):
    with open(caminho_arquivo, "rb") as arquivo:
        dados = arquivo.read()
    binario = ''.join(format(byte, '08b') for byte in dados)
    return binario


def binario_para_arquivo(binario, caminho_saida):
    print("iniciando gerar lista")
    lista_bytes = [binario[i:i+8] for i in range(0, len(binario), 8)]
    print("lista gerada")
    dados_bytes = bytearray(int(byte_str, 2) for byte_str in lista_bytes)
    print("Convertendo lista")    
    with open(caminho_saida, "wb") as arquivo:
        arquivo.write(dados_bytes)


if __name__ == "__main__":
    caminho_arquivo = input("Digite o caminho do arquivo que deseja converter: ")
    ini=time.time()
    ini_t=time.time()
    binario_str = arquivo_para_binario(caminho_arquivo)
    ini1=time.time()
    print(f"\nTempo de execução: {ini1-ini} segundos")
    print(f"\nTamanho do arquivo: {len(binario_str)} bits")
    ini=ini1
    #print(binario_str)
    caminho_saida = f"{caminho_arquivo.split('.')[0]}_recriado_1.{caminho_arquivo.split('.')[-1]}"
    binario_para_arquivo(binario_str, caminho_saida)
    print(f"\nArquivo recriado com sucesso: {caminho_saida}")
    ini1=time.time()
    print(f"\nTempo de execução: {ini1-ini} segundos")
    print(f"\nTempo de execução total: {ini1-ini_t} segundos")