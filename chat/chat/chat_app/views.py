from django.shortcuts import render
from django.urls import get_resolver
from django.http import HttpResponse, JsonResponse
import json
from pymongo import MongoClient
import requests
import time 


colecao = MongoClient("mongodb://localhost:27017/")["meu_banco"]["minha_colecao"]
url='https://0ffc-168-90-211-194.ngrok-free.app'

def index(request):
    contatos=colecao.distinct("contato")
    print(contatos)
    contatos=carregachat_interno(contatos)
    configs=requests.get(f'{url}/config').json()
    modelo=list(configs['modelo'].keys())
    personalidade=configs['personality']
    if personalidade =="":
        personalidade='Simples'
    modelo.remove("3b")
    return render(request, 'chat_app/principal.html',{"cont":contatos,"modelos":modelo,"personalidade":personalidade})
def carregachat_interno(contatos):
    novos_contatos=[]
    for contato in contatos:
        conversa=[_ for _ in colecao.find({"contato":contato})]
        for doc in conversa:
            doc["_id"] = str(doc["_id"])
        conversa.sort(key=lambda x: (x['data'], x['hora']))
        contato={"contato":contato,"conversa":conversa[-1]}
        novos_contatos.append(contato)
    novos_contatos.sort(key=lambda x: (x['conversa']['data'], x['conversa']['hora']), reverse=True)
    print(novos_contatos)
    return novos_contatos
def treinamento(request):
    return render(request, 'chat_app/treinamento.html')
def configs(request):
    return render(request, 'chat_app/confgs.html')
def imag(request):
    return render(request, 'chat_app/comfyui.html')
def api_apis(request):
    return render(request, 'chat_app/api_apis.html')
def novo_chat(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        if not colecao.find_one({'id_referente':"",'contato':nome,'pessoa':"bot",'dialogo':'Olá, Tudo bem ?'}):
            salva_msg('',nome,'bot',"Olá, Tudo bem ?")
        contatos=colecao.distinct("contato")    
        contatos=carregachat_interno(contatos)
        configs=requests.get(f'{url}/config').json()
        modelo=list(configs['modelo'].keys())
        personalidade=configs['personality']
        modelo.remove("3b")
        return render(request, 'chat_app/principal.html',{"cont":contatos,"atu":True,"contato":nome,"modelos":modelo,"personalidade":personalidade})
def mesagem(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        mesagem = data.get('mesagem')
        contato = data.get('contato')
        modelo=data.get('modelo')
        personalidade=data.get('personalidade')
        print(modelo,personalidade)
        if data.get('id') :
            id=data.get('id')
        else:
            id=""
        doc_user=salva_msg(id,contato,'user',mesagem,modelo)
        historico=[_ for _ in colecao.find({"contato":contato})]
        for doc in historico:
            doc["_id"] = str(doc["_id"])
        if personalidade == "": personalidade = 'Simples'
        dados=json.dumps({"message": mesagem,"historico": historico,"personality":personalidade ,"modelo": modelo})
        response=requests.post(f'{url}/chat',data={'payload':dados})
        doc=salva_msg(doc_user['_id'],contato,'bot',response.json()['response'],modelo)
        return JsonResponse(data={"doc":doc},status=200)
    return JsonResponse({"erro":"erro"},status=400)

def carregachat(request,contato):
    conversa=[_ for _ in colecao.find({"contato":contato})]
    for doc in conversa:
        doc["_id"] = str(doc["_id"])
    return JsonResponse(conversa,safe=False, status=200)
def salva_msg(id,contato,quem,mensagem,modelo=""):    
    t = time.strptime(time.ctime(), "%a %b %d %H:%M:%S %Y")
    doc={
        'id_referente':id,
        'contato':contato,
        'pessoa':quem,
        'modelo':modelo,
        'dialogo':mensagem,
        'data':time.strftime("%d/%m/%Y", t),
        'hora':time.strftime("%H:%M:%S", t)
    }
    result = colecao.insert_one(doc)
    doc['_id'] = str(result.inserted_id)
    print(doc)
    return doc