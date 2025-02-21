
from django.contrib import admin
from django.urls import path
from . import views

app_name='chat_app'
urlpatterns = [
    path('', views.index, name='index'),
    path('chat/<str:contato>', views.carregachat, name='carregachat'),
    path('mensagem', views.mesagem, name='mesagem'),
    path('novo_chat', views.novo_chat, name='novo_chat'),
    path('treinamento', views.treinamento, name='treinamento'),
    path('configs', views.configs, name='configs'),
    path('imag', views.imag, name='imag'),
    path('api_apis', views.api_apis, name='api_apis'),
    path("configuracoes", views.configuracoes, name="configuracoes"),
    path('salvar_config', views.salvar_config, name='salvar_config')
]
