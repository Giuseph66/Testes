import requests
import json

url = "https://0ffc-168-90-211-194.ngrok-free.app/chat"

# Dados do payload
payload_data = {
    "message": "Olá, como vai?",
    "historico": [{"role": "user", "content": "Oi"}],
    "personality": "amigável",
    "modelo": "3b"
}

payload_str = json.dumps(payload_data)
data = {
    "payload": payload_str  # deve ser enviado como string
}

# Caminho do arquivo que será enviado
file_path = "imposto.jpeg"

with open(file_path, "rb") as file:
    files = {"file": file}  # o nome "file" deve coincidir com o parâmetro do endpoint
    response = requests.post(url, data=data,files=files)

print("Status:", response.status_code)
if response.status_code == 200:
    print("Resposta:", response.json())
else:
    print("Resposta:", response.text)
