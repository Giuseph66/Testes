import os

directory = 'static/images'
for filename in os.listdir(directory):
    if filename.endswith('.png') and 'qr_code_de_' in filename:
        file_path = os.path.join(directory, filename)
        os.remove(file_path)
        print(f'Removido: {file_path}')