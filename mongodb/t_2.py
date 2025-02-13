import requests
url='https://2aa7-168-90-211-194.ngrok-free.app'


response=requests.get(f"{url}/find")
print(response.text)