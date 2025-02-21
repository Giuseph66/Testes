
from django.contrib import admin
from django.urls import path
from . import views

app_name='telas'
urlpatterns = [
    path('', views.index, name='index'),
    path('ponteiro', views.ponteiro, name='ponteiro')
]
