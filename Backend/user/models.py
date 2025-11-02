from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.utils import timezone
import uuid
import os
from datetime import timedelta

def user_profile_path(instance, filename):
    """
    Gera o caminho para salvar a imagem do perfil com nome normalizado
    baseado no ID do usuário
    """
    # Pega a extensão do arquivo original
    ext = filename.split('.')[-1].lower()
    # Valida extensões permitidas
    if ext not in ['jpg', 'jpeg', 'png', 'gif']:
        ext = 'jpg'  # fallback para jpg
    # Retorna o caminho com nome normalizado
    return f'profiles/{instance.user.id}.{ext}'

class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    password = models.CharField(max_length=128)
    reset_password_token = models.CharField(max_length=100, null=True, blank=True)
    reset_password_expires = models.DateTimeField(null=True, blank=True)
    
    # Configurações para usar email como identificador principal
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def create_reset_password_token(self):
        self.reset_password_token = str(uuid.uuid4())
        self.reset_password_expires = timezone.now() + timedelta(hours=1)
        self.save()
        return self.reset_password_token

    def is_reset_token_valid(self, token):
        return (self.reset_password_token == token and 
                self.reset_password_expires and 
                timezone.now() < self.reset_password_expires)

    def reset_password(self, new_password):
        self.password = make_password(new_password)
        self.reset_password_token = None
        self.reset_password_expires = None
        self.save()

    def __str__(self):
        return self.email
    
class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    profile = models.FileField(upload_to=user_profile_path, null=True, blank=True)
    dark_mode = models.BooleanField(default=False)

    def __str__(self):
        return f"Preferences for {self.user.email}"