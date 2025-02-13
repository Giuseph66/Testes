
from django.contrib import admin
from django.urls import path
from . import views

app_name='chat_app'
urlpatterns = [
    path('', views.index, name='index'),
    path('chat/<str:contato>', views.carregachat, name='carregachat'),
    path('mensagem', views.mesagem, name='mesagem'),
    path('novo_chat', views.novo_chat, name='novo_chat')
]
