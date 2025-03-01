import json
import urllib.request
import urllib.parse
from PIL import Image
import io
cont=0
server_address = "b51f-168-228-92-133.ngrok-free.app"
output_images = {}
def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    with urllib.request.urlopen("http://{}/view?{}".format(server_address, url_values)) as response:
        return response.read()
    
def imges(history):
    for node_id in history['outputs']:
        node_output = history['outputs'][node_id]
        if 'images' in node_output:
            images_output = []
            for image in node_output['images']:
                image_data = get_image(image['filename'], image['subfolder'], image['type'])
                images_output.append(image_data)
        output_images[node_id] = images_output

    return output_images
def get_history():
    with urllib.request.urlopen("http://{}/history".format(server_address)) as response:
        return json.loads(response.read())
todo_history = get_history()
imgs=[]
for todo in todo_history:
    images = imges(todo_history[todo])
    for node_id in images:
        for image_data in images[node_id]:
            if image_data  not in imgs:
                imgs.append(image_data)
                image = Image.open(io.BytesIO(image_data))
                image.save(f"output_{todo}.png")
                cont+=1 
            else:
                print("ja tem")
print(cont)