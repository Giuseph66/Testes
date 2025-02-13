import time
from concurrent.futures import ThreadPoolExecutor

def arquivo_para_binario_stream(caminho_arquivo, chunk_size=4096):
    """
    Lê o arquivo em blocos e gera (yield) a representação binária de cada bloco.
    
    :param caminho_arquivo: Caminho do arquivo a ser lido.
    :param chunk_size: Tamanho do bloco em bytes (padrão: 4096).
    :yield: String com a representação em bits do bloco atual.
    """
    with open(caminho_arquivo, "rb") as arquivo:
        # Obtém o tamanho total do arquivo
        arquivo.seek(0, 2)  # Move o ponteiro para o final do arquivo
        tamanho_total = arquivo.tell()  # Obtém a posição atual (tamanho_total do arquivo)
        arquivo.seek(0)  # Reposiciona o ponteiro para o início do arquivo
        print(f"{tamanho_total} bytes")

        while True:
            dados = arquivo.read(chunk_size)
            if not dados:
                break
            # Converte cada byte do bloco para uma string de 8 bits
            yield ''.join(format(byte, '08b') for byte in dados)


def binario_para_arquivo_stream(caminho_saida, binario_iter, chunk_size=4096):
    """
    Lê uma sequência de bits (por meio de um iterador que gera blocos de bits)
    e reconstrói o arquivo original escrevendo os bytes convertidos.
    
    :param caminho_saida: Caminho do arquivo de saída.
    :param binario_iter: Iterador/gerador que produz strings binárias.
    :param chunk_size: Tamanho do bloco (não é usado aqui para leitura, mas
                       cada string já contém um múltiplo de 8 bits).
    """
    with open(caminho_saida, "wb") as arquivo:
        for bin_chunk in binario_iter:
            bytes_chunk = bytearray(int(bin_chunk[i:i+8], 2) for i in range(0, len(bin_chunk), 8))
            arquivo.write(bytes_chunk)


def processar_arquivo(caminho_arquivo):
    """
    Função para processar o arquivo em uma thread separada.
    """
    # Cria um novo gerador para reconstruir o arquivo
    binario_iter = arquivo_para_binario_stream(caminho_arquivo)
    caminho_saida = f"{caminho_arquivo.rsplit('.', 1)[0]}_recriado.{caminho_arquivo.rsplit('.', 1)[-1]}"
    binario_para_arquivo_stream(caminho_saida, binario_iter)
    print(f"\nArquivo recriado com sucesso: {caminho_saida}")


if __name__ == "__main__":
    # Entrada: caminho do arquivo original.
    caminho_arquivo = input("Digite o caminho do arquivo que deseja converter: ")

    # Inicia o tempo total de execução
    ini_t = time.time()

    # Cria um ThreadPoolExecutor para gerenciar as threads
    with ThreadPoolExecutor() as executor:
        # Submete a tarefa de processamento do arquivo ao executor
        future = executor.submit(processar_arquivo, caminho_arquivo)
        # Aguarda a conclusão da tarefa
        future.result()

    # Finaliza o tempo total de execução
    fim_t = time.time()
    print(f"\nTempo de execução total: {fim_t - ini_t:.4f} segundos")