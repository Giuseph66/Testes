import crcmod
import qrcode

nome="Socorro"
chave="2330383d-733f-4f24-8869-0822f733674c"
print(chave)
valor= "{:.2f}".format(float(20))
cidade="SINOP_MT"
txt="LOJA01"
payloadFormato= "000201"
merchantCategoria="52040000"
transationCurrect="5303986"
contraCode="5802BR"
nome_tamanho=len(nome)
chave_tamanho=len(chave)
valor_tamanho=len(valor)
cidade_tamanho=len(cidade)
txt_tamanho=len(txt)
merchantAccont_tam=f"0014BR.GOV.BCB.PIX01{chave_tamanho}{chave}"
merchantAccont=f"26{len(merchantAccont_tam)}{merchantAccont_tam}"
transationAmount_valor_tam=f"0{valor_tamanho}{valor}"
if txt_tamanho<=9:
    Data_tam=f"050{txt_tamanho}{txt}"
else:
    Data_tam=f"05{txt_tamanho}{txt}"
if nome_tamanho<=9:
    nome_tamanho=f"0{nome_tamanho}"
if cidade_tamanho<=9:
    cidade_tamanho=f"0{cidade_tamanho}"
transationAmount_valor=f"54{transationAmount_valor_tam}"
merchant_Nome=f"59{nome_tamanho}{nome}"
city=f"60{cidade_tamanho}{cidade}"
Data=f"62{len(Data_tam)}{Data_tam}"
crc16="6304"
payload=f"{payloadFormato}{merchantAccont}{merchantCategoria}{transationCurrect}{transationAmount_valor}{contraCode}{merchant_Nome}{city}{Data}{crc16}"
crc16=crcmod.mkCrcFun(poly=0x11021,initCrc=0xFFFF,rev=False,xorOut=0x0000)
crc16codigo=hex(crc16(str(payload).encode("utf-8")))
crc16codigo_formatado=str(crc16codigo).replace("0x","").upper()
payload_pronta=f"{payload}{crc16codigo_formatado}"
qrcode_=qrcode.make(payload_pronta)
qrcode_.save(f"qr_code{valor}{chave}.png")
   