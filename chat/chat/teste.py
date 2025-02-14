import requests
import json
"""
from pymongo import MongoClient

colecao = MongoClient("mongodb://localhost:27017/")["meu_banco"]["minha_colecao"]

def salva_msg(pessoa,mensagem):    
    doc={
        "id_referente":'',
        'contato':"test",
        'pessoa':pessoa,
        'dialogo':mensagem
    }
    print(doc)
    result = colecao.insert_one(doc)
    doc['_id'] = str(result.inserted_id)
    return "user"
#for _ in conversa:
#    print(salva_msg(_['pessoa'],_['dialogo']))
    
colecao.delete_many({'contato':"novo"})
"""
conversa = [
    {
        'pessoa': 'user',
        'dialogo': 'Bom dia, Tudo bem?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Bom dia! Tudo bem, e com você?'
    },
    {
        'pessoa': 'user',
        'dialogo': 'Estou bem, obrigado! Gostaria de saber como posso melhorar a segurança do meu computador.'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Claro! Aqui estão algumas dicas para melhorar a segurança do seu computador: 1) Use senhas fortes, 2) Mantenha seu sistema operacional e softwares atualizados, 3) Instale um bom antivírus.'
    },
    {
        'pessoa': 'user',
        'dialogo': 'E se eu quiser proteger minha rede Wi-Fi?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Para proteger sua rede Wi-Fi, você pode: 1) Alterar a senha padrão do roteador, 2) Usar criptografia WPA3, 3) Desativar o WPS, 4) Ocultar o nome da rede (SSID).'
    },
    {
        'pessoa': 'user',
        'dialogo': 'E sobre backups? Como faço para proteger meus dados?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Backups são essenciais! Recomendo: 1) Fazer backups regulares em um disco externo ou na nuvem, 2) Usar ferramentas de backup automático, 3) Verificar periodicamente se os backups estão funcionando corretamente.'
    },
    {
        'pessoa': 'user',
        'dialogo': 'Muito obrigado pelas dicas!'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'De nada! Se precisar de mais ajuda, estou à disposição. 😊'
    }
]
ador=[
    {
        'pessoa': 'user',
        'dialogo': 'Você pode me explicar o que é phishing?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Claro! Phishing é uma técnica usada por cibercriminosos para enganar as pessoas e roubar informações sensíveis, como senhas e números de cartão de crédito. Eles geralmente se passam por empresas ou pessoas confiáveis por meio de e-mails ou sites falsos.'
    },
    {
        'pessoa': 'user',
        'dialogo': 'Como posso me proteger contra phishing?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Para se proteger contra phishing: 1) Nunca clique em links suspeitos em e-mails, 2) Verifique sempre o endereço do site antes de digitar informações sensíveis, 3) Use autenticação de dois fatores sempre que possível.'
    },
    {
        'pessoa': 'user',
        'dialogo': 'E se eu receber um e-mail suspeito?'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Se receber um e-mail suspeito, não clique em links nem baixe anexos. Denuncie o e-mail como spam e entre em contato diretamente com a empresa ou pessoa supostamente envolvida para confirmar a autenticidade.'
    },
    {
        'pessoa': 'user',
        'dialogo': 'Muito obrigado novamente!'
    },
    {
        'pessoa': 'bot',
        'dialogo': 'Disponha! Estou aqui para ajudar. 😊'
    }
]
dados={
  "message": "Gostaria de saber como melhorar a segurança do meu computador.",
  "historico": conversa,
  "personality":  "amigável",
  "modelo": "1b"
}
dadus={
  "message": "Gostaria de saber como melhorar a segurança do meu computador.",
  "historico": json.dumps([
    { "pessoa": "user", "dialogo": "Bom dia, tudo bem?" },
    { "pessoa": "bot", "dialogo": "Bom dia! Tudo bem, e com você?" },
    { "pessoa": "user", "dialogo": "Estou bem, obrigado! Gostaria de saber como posso melhorar a segurança do meu computador." },
    { "pessoa": "bot", "dialogo": "Claro! Aqui estão algumas dicas para melhorar a segurança do seu computador: 1) Use senhas fortes, 2) Mantenha seu sistema operacional e softwares atualizados, 3) Instale um bom antivírus." },
    { "pessoa": "user", "dialogo": "E se eu quiser proteger minha rede Wi-Fi?" }
  ]),
  "personality": "respostas curtas",
  "modelo": "1b"
}

caminho="chat_app/static/imgs/cerebro.png"
with open(caminho, "rb") as file:
    files = {"file": file}
    response=requests.post('https://0ffc-168-90-211-194.ngrok-free.app/chat',data=dadus,files=files)

print(response.status_code)

print(response.json())


