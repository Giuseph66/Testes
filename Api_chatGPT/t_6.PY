import pyautogui
import time
import os
import keyboard
# Abre o navegador
os.system("start msedge")
time.sleep(0.5)
pyautogui.hotkey('alt', 'space')  
pyautogui.press('x') 
pyautogui.write("https://chatgpt.com")
pyautogui.press("enter")
posicoes=[]
time.sleep(3)
pyautogui.click(x=1212, y=106)
pyautogui.click(x=1212, y=106)
time.sleep(3)
pyautogui.write("ctpcompania@gmail.com")
pyautogui.press("enter")
time.sleep(3)
pyautogui.click(x=610, y=447)
pyautogui.write("stS52vRp7s2n7ce")
pyautogui.press("enter")

"""
pyautogui.click(x=660, y=558)
pyautogui.click(x=665, y=502)"""


while True:
    try:
        # Quando 'c' for pressionado, captura a posição do mouse
        if keyboard.is_pressed('c'):
            x, y = pyautogui.position()  # Captura a posição atual do mouse
            posicoes.append((x, y))
            print(f"Posição capturada: {x}, {y}")

        if keyboard.is_pressed('q'):
            print("\nFinalizando...")
            break

    except Exception as e:
        print(f"\nFinalizando... {e}")
posicoes=list(set(posicoes))
for x, y in posicoes:
    print(f"Posição: {x}, {y}")
pyautogui.hotkey('alt', 'f4')  

