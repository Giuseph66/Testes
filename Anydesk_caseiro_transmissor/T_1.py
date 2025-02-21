import requests
import pyautogui

def redimensionar_clique(x_original, y_original, largura_original, altura_original, largura_nova, altura_nova):
    proporcao_x = largura_nova / largura_original
    proporcao_y = altura_nova / altura_original
    x_novo = x_original * proporcao_x
    y_novo = y_original * proporcao_y
    return int(x_novo), int(y_novo)

tamanho=requests.get('https://62cc-168-90-211-194.ngrok-free.app/status').json()
print(tamanho)
largura_nova = tamanho['x']
altura_nova = tamanho['y']
ponteiro=pyautogui.position()
x_original = ponteiro.x 
y_original = ponteiro.y
tela=pyautogui.size()
largura_original = tela.width
altura_original = tela.height

x_novo, y_novo = redimensionar_clique(x_original, y_original, largura_original, altura_original, largura_nova, altura_nova)
print(f"Coordenadas originais: ({x_original}, {y_original})")
print(f"Coordenadas redimensionadas: ({x_novo}, {y_novo})")