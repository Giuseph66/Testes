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
        
        print(f"To procurando : {float(data[-1][1].replace(",",".").replace("%",""))}")
    else:
        print("Tabela não encontrada no site.")
else:
    print(f"Erro ao acessar o site: {response.status_code}")
