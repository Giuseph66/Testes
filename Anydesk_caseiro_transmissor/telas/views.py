from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import requests
import json

def index(request):
    Usuario_tamanho=requests.get('https://d029-168-90-211-194.ngrok-free.app/status').json()
    print(Usuario_tamanho)
    return render(request, 'telas/home.html')

@csrf_exempt
def ponteiro(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            x = data.get('x')
            y = data.get('y')
            tamanho = data.get('tamanho')
            Usuario_tamanho=requests.get('https://d029-168-90-211-194.ngrok-free.app/status').json()
            print(tamanho['width'],tamanho['height'])
            try:
                novo_x,novo_y=redimensionar_clique(float(x),float(y),float(tamanho['width']),float(tamanho['height']),float(Usuario_tamanho['x']),float(Usuario_tamanho['y']))
                print("x:", novo_x, "y:", novo_y, "tamanho:", Usuario_tamanho)
                respo=requests.post('https://d029-168-90-211-194.ngrok-free.app/click', json={"x": novo_x, "y": novo_y})
                return JsonResponse({'dados':respo.text})
            except Exception as e:
                print("Erro ao redimensionar clique:", e)
            return JsonResponse({"x": x, "y": y, "tamanho": tamanho})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Método não suportado"}, status=405)
    
    
    
def redimensionar_clique(x_original, y_original, largura_original, altura_original, largura_nova, altura_nova):
    proporcao_x = largura_nova / largura_original
    proporcao_y = altura_nova / altura_original
    x_novo = x_original * proporcao_x
    y_novo = y_original * proporcao_y
    return int(x_novo), int(y_novo)