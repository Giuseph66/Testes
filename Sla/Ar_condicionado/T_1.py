from greeclimate.device import discover

def desligar_ar_condicionado():
    print("Procurando dispositivos Gree...")
    devices = discover(timeout=5)

    if not devices:
        print("Nenhum dispositivo Gree encontrado.")
        return
    print(devices)
    device = devices[0]  # Assume que encontrou o primeiro dispositivo
    print(f"Dispositivo encontrado: {device.name}")

    device.auth()  # Autentica o dispositivo
    device.update_state()  # Atualiza o estado do dispositivo
    
    print("Desligando o ar-condicionado...")
    #device.power = False  # Envia o comando para desligar
    print("Comando enviado com sucesso!")

desligar_ar_condicionado()
