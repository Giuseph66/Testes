import broadlink

def encontrar_dispositivo():
    print("Procurando dispositivos Broadlink/Gree na rede...")
    dispositivos = broadlink.discover(timeout=5)
    
    if not dispositivos:
        print("Nenhum dispositivo encontrado.")
        return None
    print(dispositivos)
    dispositivo = dispositivos[0]  # Assume o primeiro dispositivo encontrado
    print(f"Dispositivo encontrado: {dispositivo.host}")
    return dispositivo

def desligar_ar_condicionado(dispositivo):
    print("Conectando ao dispositivo...")
    dispositivo.auth()  # Autenticação com o dispositivo

    print("Enviando comando para desligar...")
    comando_ligar = bytearray([0x01, 0x02, 0x00, 0x01]) 
    #comando_desligar = bytearray([0x01, 0x02, 0x00, 0x00])  # Comando genérico para desligar (ajustar conforme necessário)
    dispositivo.send_data(comando_ligar)
    print("Comando enviado com sucesso!")

# Executar
dispositivo = encontrar_dispositivo()
if dispositivo:
    desligar_ar_condicionado(dispositivo)
else:
    print("Nenhum dispositivo foi encontrado.")
