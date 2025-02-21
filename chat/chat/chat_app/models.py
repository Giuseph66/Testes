from django.db import models

class Configuracao(models.Model):
    tema = models.CharField(max_length=10, choices=[("claro", "Claro"), ("escuro", "Escuro")], default="escuro")
    cor_mensagem_user = models.CharField(max_length=7, default="#007BFF")  
    cor_mensagem_bot = models.CharField(max_length=7, default="#444") 
    tamanho_fonte = models.IntegerField(default=14)
    avatar_bot = models.BooleanField(default=True)
    modelo_ia = models.CharField(max_length=10, default="3b")
    temperatura = models.FloatField(default=0.7)
    notificacoes_som = models.BooleanField(default=True)
    atalhos_ativos = models.BooleanField(default=True)

    def __str__(self):
        return f"Configuração {self.id}"
