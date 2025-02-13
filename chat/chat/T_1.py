import time 
tempo_atual = time.ctime()

t = time.strptime(tempo_atual, "%a %b %d %H:%M:%S %Y")

data_formatada = time.strftime("%d/%m/%Y", t)
hora_formatada = time.strftime("%H:%M:%S", t)
print(data_formatada,hora_formatada)