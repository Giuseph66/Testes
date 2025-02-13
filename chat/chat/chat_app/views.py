from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from pymongo import MongoClient
import requests

colecao = MongoClient("mongodb://localhost:27017/")["meu_banco"]["minha_colecao"]
url='https://a2e6-168-90-211-194.ngrok-free.app'

def index(request):
    contatos=colecao.distinct("contato")
    configs=requests.get(f'{url}/config').json()
    modelo=list(configs['modelo'].keys())
    personalidade=configs['personality']
    modelo.remove("3b")
    return render(request, 'chat_app/main.html',{"cont":contatos,"modelos":modelo,"personalidade":personalidade})
def novo_chat(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        if not colecao.find_one({'id_referente':"",'contato':nome,'pessoa':"bot",'dialogo':'Olá, Tudo bem ?'}):
            salva_msg('',nome,'bot',"Olá, Tudo bem ?")
        contatos=colecao.distinct("contato")
        configs=requests.get(f'{url}/config').json()
        modelo=list(configs['modelo'].keys())
        personalidade=configs['personality']
        modelo.remove("3b")
        return render(request, 'chat_app/main.html',{"cont":contatos,"atu":True,"contato":nome,"modelos":modelo,"personalidade":personalidade})
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
        doc_user=salva_msg(id,contato,'user',mesagem)
        historico=[_ for _ in colecao.find({"contato":contato})]
        for doc in historico:
            doc["_id"] = str(doc["_id"])
        dados={"message": mesagem,"historico": historico,"personality": personalidade,"modelo": modelo}
        response=requests.post(f'{url}/chat',json=dados)
        doc=salva_msg(doc_user['_id'],contato,'bot',response.json()['response'])
        return JsonResponse(data={"doc":doc},status=200)
    return JsonResponse({"erro":"erro"},status=400)

def carregachat(request,contato):
    conversa=[_ for _ in colecao.find({"contato":contato})]
    for doc in conversa:
        doc["_id"] = str(doc["_id"])
    global cont
    cont+=1
    return JsonResponse(conversa,safe=False, status=200)
cont=0
def salva_msg(id,contato,quem,mensagem):    
    doc={
        'id_referente':id,
        'contato':contato,
        'pessoa':quem,
        'dialogo':mensagem
    }
    result = colecao.insert_one(doc)
    doc['_id'] = str(result.inserted_id)
    print(doc)
    return doc