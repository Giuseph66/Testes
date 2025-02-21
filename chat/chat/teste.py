oremun =4654867879794516156484974917428734813435264792387417209380109
lista=[]
numero = ""
for u in str(oremun):
    lista.append(int(u))
    lista.sort()
for dados in lista:
    numero+=str(dados)
print(numero)