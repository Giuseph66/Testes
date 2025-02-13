from bs4 import BeautifulSoup
import requests

url = "https://www.remessaonline.com.br/blog/cdi-hoje-saiba-como-acompanhar-os-valores-do-indice"
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, "html.parser")
    
    table = soup.find("figure", class_="wp-block-table")
    if table:
        data = []
        
        for row in table.find_all("tr")[1:]:  
            cols = row.find_all("td")
            data.append([col.text.strip() for col in cols])
        cdi=float(data[-1][1].replace(",",".").replace("%",""))
        print(f"Encontrado ultimo valor da CDI : {cdi}")
    else:
        print("Tabela não encontrada no site.")
else:
    print(f"Erro ao acessar o site: {response.status_code}")

if not cdi:
    juro_mensal=float(input("Digite o juro mensal: ").replace(",","."))
else:
    valor_adicional_cdi=float(input("Digite o valor adicional da CDI: ").replace(",","."))
    juro_mensal=((cdi/100)*(valor_adicional_cdi/100))*100
    
print(f"Juro mensal: {juro_mensal}")
valor_inicial=float(input("Digite o valor inicial: "))
tempo=float(input("Digite o tempo em meses: "))

#Calcular juro composto 
juro_composto=valor_inicial*(1+(juro_mensal/100))**tempo
lucro=juro_composto-valor_inicial
print(f"Juro composto: {juro_composto:.2f} / lucro de {lucro:.2f}")

dias=tempo*30
imposto=0.225
if dias>=180:
    imposto=0.20
if dias>=360:
    imposto=0.175
if dias>=720:
    imposto=0.15

valor_real=lucro-lucro*imposto
print(f"Valor final: {valor_inicial+valor_real:.2f} / Lucro real: {valor_real:.2f} / imposto de {lucro*imposto:.2f}")
