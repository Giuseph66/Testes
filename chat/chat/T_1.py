import requests
import json

url = "https://194f-168-90-211-194.ngrok-free.app/openapi.json"

response = requests.get(url)

print("Status:", response.status_code)
if response.status_code == 200:
    try:
        print("Resposta:", response.json())
    except:
        print("Resposta:", response.text)
else:
    print("Resposta:", response.text)
