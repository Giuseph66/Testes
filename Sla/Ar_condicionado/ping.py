import os
import platform

def listar_ips_rede():
    print("Listando dispositivos na rede...")

    # Comando para ping em todos os IPs
    ip_base = "192.168.1."  # Ajuste conforme sua rede
    for i in range(1, 255):
        ip = f"{ip_base}{i}"
        parametro = "-n" if platform.system().lower() == "windows" else "-c"
        response = os.system(f"ping {parametro} 1 {ip} > nul 2>&1")
        if response == 0:
            print(f"Dispositivo ativo encontrado: {ip}")
        else:
            print(f"Nenhum dispositivo encontrado em: {ip}")

listar_ips_rede()
