from scapy.all import ARP, Ether, srp

def escanear_rede(rede):
    print(f"Escaneando a rede: {rede}...")
    # Criar pacote ARP para escanear a rede
    pacote = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=rede)
    
    # Enviar pacotes ARP e obter respostas
    resultado, _ = srp(pacote, timeout=2, verbose=False)
    
    dispositivos = []
    for _, resposta in resultado:
        dispositivos.append({'ip': resposta.psrc, 'mac': resposta.hwsrc})

    # Exibir os dispositivos encontrados
    print("\nDispositivos encontrados:")
    for dispositivo in dispositivos:
        print(f"IP: {dispositivo['ip']} - MAC: {dispositivo['mac']}")
    
    return dispositivos

# Escanear a rede 192.168.0.1/24 (ajuste conforme necessário)
escanear_rede("192.168.1.191/24")
