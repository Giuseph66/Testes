from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
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
    distancia INTEGER NOT NULL,
    data_hora DATETIME NOT NULL,
    ip_rede TEXT NOT NULL,
    seed INTEGER NOT NULL,
    demorou INTEGER NOT NULL,
    habilidades TEXT,  
    pontos TEXT        
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
            "distancia": int(row[2]),
            "data_hora": row[3],
            "ip_rede": row[4],
            "seed": row[5],
            "demorou": int(row[6]),
            "habilidades": json.loads(row[7]),
            "pontos": json.loads(row[8])
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
        print(dados)
        nome = dados.get('nome').upper()
        distancia = dados.get('distance')
        demorou = float(dados.get('tempo'))
        momento = dados.get('momento')
        seed = dados.get('seed')
        ip_rede = dados.get('ip')
        habilidades = json.dumps(dados.get('abilidades'))  
        pontos = json.dumps(dados.get('pontos'))  

        result = cursor.execute("SELECT * FROM record WHERE nome = ? ", (nome,)).fetchall()
        if result:
            for row in result:
                #id, name, distancia_banco, data_hora, ip, seed_banco, habilidades_banco, pontos_banco = row
                if int(distancia) > int(row[2]):
                    cursor.execute("UPDATE record SET distancia = ?, habilidades = ?, pontos = ? , demorou =? WHERE id = ?", 
                                   (distancia, habilidades, pontos,demorou, row[0]))
                    banco.commit()
                    print(f"Registro {row[0]} atualizado de {row[2]} para {distancia}")
                if ip_rede != row[4] and ip_rede != "Nao suportado":
                    cursor.execute("UPDATE record SET ip_rede = ? WHERE id = ?", (ip_rede, row[0]))
                    banco.commit()
                    print(f"Registro {row[0]} atualizado de {row[4]} para {ip_rede}")
        else:
            cursor.execute("INSERT INTO record (nome, distancia, data_hora, ip_rede, seed, habilidades, pontos,demorou) VALUES (?, ?, ?, ?,?, ?, ?, ?)",
                           (nome, distancia, momento, ip_rede, seed, habilidades, pontos,demorou))
            banco.commit()
            print(f"Usuario : {nome} adicionado com sucesso")

        return jsonify({"mensagem": "Dados recebidos com sucesso",'status':200}), 200
    except Exception as e:
        return jsonify({"erro": str(e),'status':500}), 500

if __name__ == '__main__':
    app.run(debug=True)
