from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import qrcode
import crcmod
import json

app = Flask(__name__, template_folder='templates')
CORS(app)

# Conecta ao banco de dados
banco = sqlite3.connect("banco.db", check_same_thread=False)
cursor = banco.cursor()

# Cria a tabela 'record' se ela não existir
cursor.execute("""
CREATE TABLE IF NOT EXISTS record (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    nome TEXT,
    senha TEXT NOT NULL,
    distancia INTEGER NOT NULL,
    data_hora DATETIME NOT NULL,
    ip_rede TEXT NOT NULL,
    seed INTEGER NOT NULL,
    demorou INTEGER NOT NULL,
    habilidades TEXT,  
    pontos TEXT,        
    backup TEXT        
)
""")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/customize')
def customize():
    return render_template('loja.html')

@app.route('/game_over')
def game_over():
    return render_template('game_over.html')

@app.route('/records')
def records():
    cursor.execute("SELECT * FROM record")
    records = cursor.fetchall()
    records = [
        {
            "id": row[0],
            "nome": row[1],
            "distancia": int(row[3]),
            "data_hora": row[4],
            "ip_rede": row[5],
            "seed": row[6],
            "demorou": int(row[7]),
            "habilidades": json.loads(row[8]),
            "pontos": json.loads(row[9])
        }
        for row in records
    ]
    records = sorted(records, key=lambda x: x['distancia'], reverse=True)
    return render_template('records.html', records=records)

@app.route('/receber_dados', methods=['POST'])
def receber_dados():
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Nenhum dado recebido"}), 400

    try:
        #print(dados)
        nome = dados.get('nome').upper()
        senha= dados.get('senha')
        distancia = dados.get('distance')
        demorou = float(dados.get('tempo'))
        momento = dados.get('momento')
        backup = dados.get('backup')
        seed = dados.get('seed')
        ip_rede = dados.get('ip')
        habilidades = json.dumps(dados.get('abilidades'))  
        pontos = json.dumps(dados.get('pontos'))  
        result = cursor.execute("SELECT * FROM record WHERE nome = ? ", (nome,)).fetchall()
        if result:
            for row in result:
                if row[2]==str(senha):
                    #id, name, distancia_banco, data_hora, ip, seed_banco, habilidades_banco, pontos_banco = 
                    print(backup)
                    if not backup['altorizar'] or backup['altorizar'] is None:
                        return jsonify({"mensagem": row[10],'status':999}), 999
                    if int(distancia) > int(row[3]):
                        cursor.execute("UPDATE record SET distancia = ?, habilidades = ?, pontos = ? , demorou =? , backup =? WHERE id = ?", 
                        (distancia, habilidades, pontos,demorou,json.dumps(backup), row[0]))
                        banco.commit()
                        print(f"Registro {row[0]} atualizado de {row[3]} para {distancia}")
                    if ip_rede != row[5] and ip_rede != "Nao suportado":
                        cursor.execute("UPDATE record SET ip_rede = ? WHERE id = ?", (ip_rede, row[0]))
                        banco.commit()
                        print(f"Registro {row[0]} atualizado de {row[5]} para {ip_rede}")
                else:
                    return jsonify({"mensagem": "senha incorreta",'status':300}), 300
        else:
            cursor.execute("INSERT INTO record (nome,senha, distancia, data_hora, ip_rede, seed, habilidades, pontos,demorou,backup) VALUES (?,?,?, ?, ?, ?,?, ?, ?, ?)",
            (nome,senha, distancia, momento, ip_rede, seed, habilidades, pontos,demorou,json.dumps(backup)))
            banco.commit()
            print(f"Usuario : {nome} adicionado com sucesso")
        return jsonify({"mensagem": "Dados recebidos com sucesso",'status':200}), 200

    except Exception as e:
        return jsonify({"erro": str(e),'status':500}), 500

@app.route('/pix', methods=['POST'])
def pix():
    valor = request.get_json()
    if not valor:
        return jsonify({"erro": "Nenhum dado recebido"}), 
    nome="Socorro"
    chave="c6ec5090-a098-46b5-a4ca-8d38ff19c211"
    valor= "{:.2f}".format(float(valor))
    cidade="SINOP_MT"
    txt="LOJA01"
    payloadFormato= "000201"
    merchantCategoria="52040000"
    transationCurrect="5303986"
    contraCode="5802BR"
    nome_tamanho=len(nome)
    chave_tamanho=len(chave)
    valor_tamanho=len(valor)
    cidade_tamanho=len(cidade)
    txt_tamanho=len(txt)
    merchantAccont_tam=f"0014BR.GOV.BCB.PIX01{chave_tamanho}{chave}"
    merchantAccont=f"26{len(merchantAccont_tam)}{merchantAccont_tam}"
    transationAmount_valor_tam=f"0{valor_tamanho}{valor}"
    if txt_tamanho<=9:
        Data_tam=f"050{txt_tamanho}{txt}"
    else:
        Data_tam=f"05{txt_tamanho}{txt}"
    if nome_tamanho<=9:
        nome_tamanho=f"0{nome_tamanho}"
    if cidade_tamanho<=9:
        cidade_tamanho=f"0{cidade_tamanho}"
    transationAmount_valor=f"54{transationAmount_valor_tam}"
    merchant_Nome=f"59{nome_tamanho}{nome}"
    city=f"60{cidade_tamanho}{cidade}"
    Data=f"62{len(Data_tam)}{Data_tam}"
    crc16="6304"
    payload=f"{payloadFormato}{merchantAccont}{merchantCategoria}{transationCurrect}{transationAmount_valor}{contraCode}{merchant_Nome}{city}{Data}{crc16}"
    crc16=crcmod.mkCrcFun(poly=0x11021,initCrc=0xFFFF,rev=False,xorOut=0x0000)
    crc16codigo=hex(crc16(str(payload).encode("utf-8")))
    crc16codigo_formatado=str(crc16codigo).replace("0x","").upper()
    payload_pronta=f"{payload}{crc16codigo_formatado}"
    qrcode_=qrcode.make(payload_pronta)
    qrcode_.save(f"static/images/qr_code_de_{valor}.png")
    return jsonify({"mensagem": "Dados recebidos com sucesso","status":200,"img_url": f"/static/images/qr_code_de_{valor}.png","pqp": payload_pronta}), 200
if __name__ == '__main__':
    app.run(debug=True)
