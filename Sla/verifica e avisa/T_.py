from win10toast import ToastNotifier
from playsound import playsound
import threading

def tocar_som():
    playsound("Som.mp3")


threading.Thread(target=tocar_som).start()

