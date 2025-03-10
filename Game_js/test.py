import sqlite3

banco=sqlite3.connect("banco.db")

cursor = banco.cursor()
cursor.execute("DROP TABLE IF EXISTS record")
"""if cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='record'").fetchone() is None:
    cursor.execute("CREATE TABLE record (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nome TEXT, distancia INTEGER NOT NULL, data_hora DATETIME NOT NULL, ip_rede TEXT NOT NULL,seed INTEGER NOT NULL )")

result=cursor.execute("SELECT * FROM record").fetchall()
print(result)
add=True
for row in result:
    id,name,distancia_banco,data_hora,ip,seed=row
    if name==nome and ip==ip_rede:
        add=False
        print("Já existe um registro com esse nome")
        if distancia>row[2]:
            cursor.execute("Update record set Distancia=? WHERE id=?", (distancia,id))
            banco.commit()
            print(f"Registro {id} atualizado de {row[2]} para {distancia}")
        break
if add:
    cursor.execute("INSERT INTO record (nome, distancia, data_hora, ip_rede, seed) VALUES (?,?,?,?,?)",(nome,distancia,data_hora,ip_rede,seed))
    banco.commit()
    print(f"Usuario : {nome} adicionado com sucesso")
    
banco.close()
"""