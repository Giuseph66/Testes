import requests
import json

url = "https://5b8a-168-90-211-194.ngrok-free.app/chat"

payload_data = {
    "message": "Olá, como vai?",
    "historico": [{"role": "user", "content": "Oi"}],
    "personality": "amigável",
    "modelo": "3b"
}

payload_str = json.dumps(payload_data)
data = {
    "payload": payload_str  
}

file_path = "test.mp3"

with open(file_path, "rb") as file:
    files = {"file": file} 
    response = requests.post(url, data=data,files=files)

print("Status:", response.status_code)
if response.status_code == 200:
    print("Resposta:", response.json())
else:
    print("Resposta:", response.text)
