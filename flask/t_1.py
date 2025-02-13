from flask import Flask,render_template

app = Flask(__name__)

@app.route("/")
def home():
    js={'sla':'ola',
        'ola':'sla'}
    return js
@app.route("/usuario/<nome>")
def mostrar_usuario(nome):
    return f"Olá, {nome}!"
@app.route("/html")
def html():
    return render_template("main.html")
if __name__ == "__main__":
    app.run(debug=True)
