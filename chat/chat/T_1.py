def é_primo(n): 
    """Retorna True se n é primo, False caso contrário""" 
    if n <= 1: 
        return False 
    for i in range(2, int(n ** 0.5) + 1): 
        if n % i == 0: 
            return False 
    return True 
def encontrar_primos(max_n): 
    """Encontra os números primos até max_n""" 
    primos = []
    for n in range(2, max_n + 1): 
        if é_primo(n): 
            primos.append(n) 
    return sorted(primos) 
import itertools 
from time import perf_counter 
def encontrar_primos_melhorada(max_n): 
    """Encontra os números primos até max_n usando a fórmula de Euler""" 
    primos = set() 
    for n in range(2, max_n + 1): 
        if é_primo(n): 
            primos.add(n) # Filtro dos números compostos 
            divisor_max = int(max_n ** 0.5) + 1 
            não_primos = set(range(4, max_n + 1, 2)) 
            for i in range(3, divisor_max, 2): 
                j = (divisor_max // i - 1) * i + 1 
                não_primos -= set(range(j, max_n + 1, i)) 
    return sorted(list(primos - não_primos)) 
def eh_primo(n):
    """Verifica se um número é primo"""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):  # Verifica divisibilidade até a raiz quadrada de n
        if n % i == 0:
            return False
    return True
def primos_ate(limite):
    """Retorna uma lista de números primos até um limite"""
    return [n for n in range(2, limite + 1) if eh_primo(n)]

if __name__ == "__main__": 
    max_n = int(input("Insira o valor máximo: ")) # Medir o tempo de execução das funções 
    t1 = perf_counter() 
    """euler = encontrar_primos_melhorada(max_n) 
    t2 = perf_counter() 
    itativa=encontrar_primos(max_n)"""
    t3 = perf_counter() 
    chat=primos_ate(max_n)
    t4 = perf_counter() 
    print(f"Números primos até {max_n}:") 
    print(f"Tempo de execução: {t4 - t1:.6f} segundos") 
    #print(f"Método 1 (itativa)({t3-t2:.6f} segundos)({len(itativa)}):{itativa}") 
    #print(f"Método 2 (Euler)({t2-t1:.6f} segundos)({len(euler)}):{euler}") 
    print(f"Método 3 (chat)({t4-t3:.6f} segundos)({len(chat)})")