import requests
import json

url = "https://5b8a-168-90-211-194.ngrok-free.app/set"

payload = {"tipo": "set_large"}
response = requests.post(url, json=payload)

print("Status:", response.status_code)
if response.status_code == 200:
    print("Resposta:", response.json())
else:
    print("Resposta:", response.text)
