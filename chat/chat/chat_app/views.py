from django.shortcuts import render
from django.urls import get_resolver
from django.http import HttpResponse, JsonResponse
from .models import *
import json
from pymongo import MongoClient, errors
import requests
import time 

<<<<<<< HEAD
try:
    colecao = MongoClient("mongodb://localhost:27017/")["meu_banco"]["minha_colecao"]
except errors.ServerSelectionTimeoutError as e:
    colecao = None
    print(f"Erro ao conectar ao banco de dados: {e}")
url='https://b008-168-90-211-194.ngrok-free.app/'

def index(request):
    config = Configuracao.objects.first()  
    if colecao is not None:
        try:
            contatos=colecao.distinct("contato")
            contatos=carregachat_interno(contatos)
            configs=requests.get(f'{url}/config').json()
            modelo=list(configs['modelo'].keys())
            personalidade=configs['personality']
            if personalidade =="":
                personalidade='Simples'
            modelo.remove(config.modelo_ia)
        except errors.PyMongoError as e:
            print(f"Erro ao acessar a coleção: {e}")
            contatos=[]
            modelo=[]
            personalidade="Sem acesso "
        except requests.RequestException as e:
            print(f"Erro ao acessar a URL de configuração: {e}")
            configs=[]
            modelo=[]
            personalidade="Sem acesso "
    else:
        contatos=[]
        modelo=[]
        personalidade="Sem acesso "
=======

colecao = MongoClient("mongodb://localhost:27017/")["meu_banco"]["minha_colecao"]
url='https://d362-177-155-221-140.ngrok-free.app'

def index(request):
    contatos=colecao.distinct("contato")
    contatos=carregachat_interno(contatos)
    configs=requests.get(f'{url}/config').json()
    modelo=list(configs['modelo'].keys())
    personalidade=configs['personality']
    if personalidade =="":
        personalidade='Simples'
    try:
        config = Configuracao.objects.first()  
        modelo.remove(config.modelo_ia)
    except:
        pass
>>>>>>> 327bcbe (kali 03/03/25)
    return render(request, 'chat_app/principal.html',{"cont":contatos,"modelos":modelo,"personalidade":personalidade,"config": config})

def carregachat_interno(contatos):
    novos_contatos=[]
    if colecao is not None:
        try:
            for contato in contatos:
                conversa=[_ for _ in colecao.find({"contato":contato})]
                for doc in conversa:
                    doc["_id"] = str(doc["_id"])
                conversa.sort(key=lambda x: (x['data'], x['hora']))
                contato={"contato":contato,"conversa":conversa[-1]}
                novos_contatos.append(contato)
            novos_contatos.sort(key=lambda x: (x['conversa']['data'], x['conversa']['hora']), reverse=True)
        except errors.PyMongoError as e:
            print(f"Erro ao acessar a coleção: {e}")
    print(novos_contatos)
    return novos_contatos

def treinamento(request):
    config = Configuracao.objects.first()  
    return render(request, 'chat_app/treinamento.html',{"config": config})

def configs(request):
<<<<<<< HEAD
    try:
        configs=requests.get(f'{url}/config').json()
        modelo=list(configs['modelo'].keys())
        config = Configuracao.objects.first()  
        modelo.remove(config.modelo_ia)
    except requests.RequestException as e:
        print(f"Erro ao acessar a URL de configuração: {e}")
        configs=[]
        modelo=[]
    config = Configuracao.objects.first()  
=======
    configs=requests.get(f'{url}/config').json()
    modelo=list(configs['modelo'].keys())
    try:
        config = Configuracao.objects.first()  
        modelo.remove(config.modelo_ia)
    except:
        pass
>>>>>>> 327bcbe (kali 03/03/25)
    return render(request, 'chat_app/confgs.html',{"config": config,"modelos":modelo})

def imag(request):
    config = Configuracao.objects.first()  
    return render(request, 'chat_app/comfyui.html',{"config": config})

def api_apis(request):
    config = Configuracao.objects.first()  
    return render(request, 'chat_app/api_apis.html',{"config": config})

def novo_chat(request):
    config = Configuracao.objects.first()  
    if colecao is not None:
        if request.method == 'POST':
            nome = request.POST.get('nome').strip()
            try:
                if not colecao.find_one({'id_referente':"",'contato':nome,'pessoa':"bot",'dialogo':'Olá, Tudo bem ?'}):
                    salva_msg('',nome,'bot',"Olá, Tudo bem ?")
                contatos=colecao.distinct("contato")    
                contatos=carregachat_interno(contatos)
                configs=requests.get(f'{url}/config').json()
                modelo=list(configs['modelo'].keys())
                personalidade=configs['personality']
                if personalidade =="":
                    personalidade='Simples'
                config = Configuracao.objects.first()  
                modelo.remove(config.modelo_ia)
            except errors.PyMongoError as e:
                print(f"Erro ao acessar a coleção: {e}")
                contatos=[]
                modelo=[]
                personalidade="Sem acesso "
            except requests.RequestException as e:
                print(f"Erro ao acessar a URL de configuração: {e}")
                modelo=[]
                personalidade="Sem acesso "
    else:
        contatos=[]
        modelo=[]
        personalidade="Sem acesso "
        nome=""
    return render(request, 'chat_app/principal.html',{"cont":contatos,"atu":True,"contato":nome,"modelos":modelo,"personalidade":personalidade,"config": config})

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
        if colecao is not None:
            try:
                historico=[_ for _ in colecao.find({"contato":contato})]
                for doc in historico:
                    doc["_id"] = str(doc["_id"])
                if personalidade == "": personalidade = 'Simples'
                dados=json.dumps({"message": mesagem,"historico": historico,"personality":personalidade ,"modelo": modelo})
                response=requests.post(f'{url}/chat',data={'payload':dados})
                doc=salva_msg(doc_user['_id'],contato,'bot',response.json()['response'],modelo)
                return JsonResponse(data={"doc":doc},status=200)
            except errors.PyMongoError as e:
                print(f"Erro ao acessar a coleção: {e}")
            except requests.RequestException as e:
                print(f"Erro ao acessar a URL de chat: {e}")
    return JsonResponse({"erro":"erro"},status=400)

def carregachat(request,contato):
    if colecao is not None:
        try:
            conversa=[_ for _ in colecao.find({"contato":contato})]
            for doc in conversa:
                doc["_id"] = str(doc["_id"])
            return JsonResponse(conversa,safe=False, status=200)
        except errors.PyMongoError as e:
            print(f"Erro ao acessar a coleção: {e}")
    return JsonResponse({"erro":"Banco de dados indisponível"},status=500)

def configuracoes(request):
    config = Configuracao.objects.first()  
    return render(request, 'chat_app/configuracoes.html', {"config": config})

def salvar_config(request):
    if request.method == "POST":
        config = Configuracao.objects.first()
        if not config:
            config = Configuracao.objects.create()

        config.tema = request.POST.get("tema", config.tema)
        config.cor_mensagem_user = request.POST.get("cor_mensagem_user", config.cor_mensagem_user)
        config.cor_mensagem_bot = request.POST.get("cor_mensagem_bot", config.cor_mensagem_bot)
        config.tamanho_fonte = request.POST.get("tamanho_fonte", config.tamanho_fonte)
        config.avatar_bot = request.POST.get("avatar_bot") == "true"
        config.modelo_ia = request.POST.get("modelo_ia", config.modelo_ia)
        config.temperatura = float(request.POST.get("temperatura", config.temperatura))
        config.notificacoes_som = request.POST.get("notificacoes_som") == "true"
        config.atalhos_ativos = request.POST.get("atalhos_ativos") == "true"
        config.save()

        return JsonResponse({"status": "success", "message": "Configurações salvas!"})

def salva_msg(id,contato,quem,mensagem,modelo=""):    
    if colecao is not None:
        try:
            t = time.strptime(time.ctime(), "%a %b %d %H:%M:%S %Y")
            doc={
                'id_referente':id,
                'contato':contato.strip(),
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
        except errors.PyMongoError as e:
            print(f"Erro ao salvar mensagem: {e}")
    return None