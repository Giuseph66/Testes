import cv2
import numpy as np
import mss
from flask import Flask, Response

app = Flask(__name__)

def gerar_frames():
    # Inicia a captura de tela
    with mss.mss() as sct:
        # Seleciona o monitor a ser capturado (a lista começa em 1)
        monitor = sct.monitors[1]
        while True:
            # Captura a tela do monitor definido
            img = sct.grab(monitor)
            # Converte a imagem para um array NumPy
            frame_np = np.array(img)
            # Converte de BGRA para BGR (necessário para o OpenCV)
            frame = cv2.cvtColor(frame_np, cv2.COLOR_BGRA2BGR)
            # Codifica o frame para JPEG
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            # Converte o array de bytes para bytes e gera o formato MJPEG
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    # Retorna uma resposta com o stream MJPEG
    return Response(gerar_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Executa o servidor na porta 5000 (acessível em http://localhost:5000/video_feed)
    app.run(host='0.0.0.0', port=5000, threaded=True)
