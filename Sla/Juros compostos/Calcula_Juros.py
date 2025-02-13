"""
valor_inicial=1000000
juro_mensal=0.7798
tempo=1
"""
valor_inicial=float(input("Digite o valor inicial: "))
juro_mensal=float(input("Digite o juro mensal: ").replace(",","."))
tempo=float(input("Digite o tempo em meses: "))

#Calcular juro simples
juro_simples=valor_inicial+((valor_inicial*(juro_mensal/100))*tempo)
print(f"Juro simples: {juro_simples:.2f} / lucro de {juro_simples-valor_inicial:.2f}")

#Calcular juro composto 
juro_composto=valor_inicial*(1+(juro_mensal/100))**tempo
print(f"Juro composto: {juro_composto:.2f} / lucro de {juro_composto-valor_inicial:.2f}")