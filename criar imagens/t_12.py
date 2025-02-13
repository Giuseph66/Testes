import json
import asyncio
import websockets
import json

cont=0
server_address = "7056-168-90-211-194.ngrok-free.app"
#prompt_id="4f544a26-68e7-45bc-81fb-8b6c448908b2"
prompt_id="91c52450-8bb2-492d-9602-52663adaa782"

async def monitor_progress():
    uri = f"wss://{server_address}/ws"
    
    async with websockets.connect(uri) as websocket:
        print("Conectado ao WebSocket do ComfyUI...")
        
        while True:
            try:
                message = await websocket.recv()
                data = json.loads(message)

                print(json.dumps(data, indent=4))
                print(data)
                if "status" in data and data["status"] == "completed":
                    print("Geração concluída!")
                    break

            except Exception as e:
                print(f"Erro: {e}")
                break

# Rodar a função assíncrona
asyncio.run(monitor_progress())
