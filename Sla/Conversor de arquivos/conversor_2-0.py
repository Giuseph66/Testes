import time
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
            """tamanho_atual = arquivo.tell()
            print(f"{float(tamanho_atual)/float(tamanho_total)*100:.2f}%")"""
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


if __name__ == "__main__":
    # Entrada: caminho do arquivo original.
    caminho_arquivo = input("Digite o caminho do arquivo que deseja converter: ")

    # CONVERSÃO: arquivo -> sequência binária (em streaming)
    ini_t=time.time()
    ini = time.time()
    print("\nConteúdo binário do arquivo:")
    # Para demonstrar, vamos imprimir cada bloco convertido.
    # OBSERVAÇÃO: Imprimir muitos dados no console pode demorar; para arquivos enormes, 
    # talvez seja melhor apenas processar sem imprimir.
    """for bin_chunk in arquivo_para_binario_stream(caminho_arquivo):
        print(bin_chunk, end='')  # 'end' para evitar quebra de linha extra"""

    # Reconstrução do arquivo a partir do mesmo processo (cria um novo gerador)
    # Importante: como geradores se esgotam após serem iterados, precisamos criar um novo.
    caminho_saida = f"{caminho_arquivo.rsplit('.', 1)[0]}_recriado.{caminho_arquivo.rsplit('.', 1)[-1]}"
    # Cria um novo gerador para reconstruir o arquivo
    binario_iter = arquivo_para_binario_stream(caminho_arquivo)
    fim = time.time()
    print(f"\n\nTempo de execução da conversão e impressão: {fim - ini:.4f} segundos")
    ini = time.time()
    binario_para_arquivo_stream(caminho_saida, binario_iter)
    fim = time.time()
    print(f"\nArquivo recriado com sucesso: {caminho_saida}")
    print(f"Tempo de execução da recriação: {fim - ini:.4f} segundos")
    print(f"\nTempo de execução total: {fim-ini_t} segundos")
