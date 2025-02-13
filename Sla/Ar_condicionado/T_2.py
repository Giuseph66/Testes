from greeclimate import GreeDevice
import socket

def encontrar_dispositivo_gree():
    print("Procurando dispositivos Gree na rede...")

    # Descoberta manual do dispositivo Gree
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    udp_socket.settimeout(5)

    broadcast_message = '{"t":"scan"}'
    udp_socket.sendto(broadcast_message.encode(), ('255.255.255.255', 7000))

    try:
        data, addr = udp_socket.recvfrom(1024)
        print(f"Dispositivo encontrado em {addr[0]} com dados: {data}")
        print(f"Dispositivos encontrado em {addr}")
        return addr[0]
    except socket.timeout:
        print("Nenhum dispositivo Gree encontrado.")
        return None
    finally:
        udp_socket.close()

def desligar_ar_condicionado(ip):
    print("Conectando ao dispositivo...")
    device = GreeDevice(ip)
    device.update_state()

    print("Desligando o ar-condicionado...")
    #device.power = False
    print("Ar-condicionado desligado com sucesso!")

# Executar
ip_dispositivo = encontrar_dispositivo_gree()
if ip_dispositivo:
    desligar_ar_condicionado(ip_dispositivo)
else:
    print("Não foi possível encontrar o ar-condicionado.")
