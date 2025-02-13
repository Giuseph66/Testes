from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["meu_banco"]

colecao = db["minha_colecao"]

documento = {
    "nome": "Maria",
    "idade": 28,
    "cidade": "Rio de Janeiro"
}

#resultado = colecao.insert_one(documento)
#print("Documento inserido com ID:", resultado.inserted_id)
#print(colecao.list_indexes())
#colecao.distinct("conversa")
colecao.delete_many({"contato": "test"})
"""ret=colecao.distinct("contato")
print(ret)
for r in ret:
    print(r)"""