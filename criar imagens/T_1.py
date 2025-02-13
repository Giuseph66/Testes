import random
from PIL import Image
import io
import websocket
import uuid
import json
import urllib.request
import urllib.parse

server_address = "7056-168-90-211-194.ngrok-free.app"
client_id = str(uuid.uuid4())

def get_history(prompt_id):
    with urllib.request.urlopen("http://{}/history/{}".format(server_address, prompt_id)) as response:
        return json.loads(response.read())
def queue_prompt(prompt):
    p = {"prompt": prompt, "client_id": client_id}
    data = json.dumps(p).encode('utf-8')
    req =  urllib.request.Request(f"https://{server_address}/prompt", data=data)
    return json.loads(urllib.request.urlopen(req).read())
def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("http://{}/view?{}".format(server_address, url_values)) as response:
        return response.read()
def status(dados,mesage):
    if mesage.get("type") == "crystools.monitor":
        cpu = mesage["data"]["cpu_utilization"]
        ram = mesage["data"]["ram_used_percent"]
        gpu = mesage["data"]["gpus"]
        dados["cpu"],dados["ram"],dados["gpu"]= cpu,ram,gpu
    elif mesage.get("type") == "progress":
        max = mesage["data"]["max"]
        atual = mesage["data"]["value"]
        porcentagem = (atual/max)*100
        dados["max"],dados["atual"],dados["porcentagem"]= max,atual,porcentagem
    else:
        print(mesage)
    return dados
def get_images(ws, prompt):
    dados={"cpu":"0","ram":"0", "gpu": "0", "max": prompt["3"]["inputs"]["steps"], "atual": "0", "porcentagem":"0"}
    prompt_id = queue_prompt(prompt)['prompt_id']
    print(prompt_id)
    output_images = {}
    current_node = ""
    while True:
        out = ws.recv()
        message = json.loads(out)
        dados=status(dados,message)
        print(f"Total CPU: {dados['cpu']}%, RAM {dados['ram']}% / Max {dados['max']}, Atual {dados['atual']}, Porcentagem {dados['porcentagem']}%")
        if isinstance(out, str):
            if message['type'] == 'executing':
                data = message['data']
                if data['prompt_id'] == prompt_id:
                    if data['node'] is None:
                        break #Execution is done
                    else:
                        current_node = data['node']
        else:
            continue
        
    history = get_history(prompt_id)[prompt_id]
    for o in history['outputs']:
        for node_id in history['outputs']:
            node_output = history['outputs'][node_id]
            if 'images' in node_output:
                images_output = []
                for image in node_output['images']:
                    image_data = get_image(image['filename'], image['subfolder'], image['type'])
                    images_output.append(image_data)
            output_images[node_id] = images_output

    return output_images


output_file = "pose_test.json"

with open(output_file, "r", encoding="utf-8") as file:
    prompt = json.load(file)
    
seed = random.randint(1, 1000000000)
prompt["3"]["inputs"]["seed"] = seed
prompt["10"]["inputs"]["image"] = "corrida.png"
#print(json.dumps(prompt, indent=4, ensure_ascii=False))

ws = websocket.WebSocket()
ws.connect(f"wss://{server_address}/ws?clientId={client_id}")
print("Done")
images = get_images(ws, prompt)
ws.close() 
for node_id in images:
    for image_data in images[node_id]:
        image = Image.open(io.BytesIO(image_data))
        image.show()
        image.save(f"output_{node_id}_{seed}.png")
print("cabo")
