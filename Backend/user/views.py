from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializer import (
    UserSerializer, 
    UserPreferencesSerializer, 
    LoginSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)
from .models import User, UserPreferences
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import base64
import os
            


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        print(f"Dados recebidos: {request.data}")  # Debug
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Erros de validação: {serializer.errors}")  # Debug
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuário criado com sucesso',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Erro ao criar usuário: {str(e)}")  # Debug
            return Response({
                'error': f'Erro interno: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        
        preferences, created = UserPreferences.objects.get_or_create(user=user)
        
        user_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'username': user.username,
            'preferences': {
                'id': preferences.id,
                'dark_mode': preferences.dark_mode,
                'profile_url': request.build_absolute_uri(preferences.profile.url) if preferences.profile else None,
            }
        }
        return Response(user_data, status=status.HTTP_200_OK)
    
class UserPreferencesView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        preferences, created = UserPreferences.objects.get_or_create(user=user)
        return preferences

class ProfileImageUploadView(generics.UpdateAPIView):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.preferences

    def update(self, request, *args, **kwargs):
        preferences = self.get_object()
        
        if 'profile' in request.FILES:
            preferences.profile = request.FILES['profile']
            preferences.save()
            
            return Response({
                'message': 'Foto de perfil atualizada com sucesso',
                'profile_url': preferences.profile.url if preferences.profile else None
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Nenhuma imagem fornecida'
        }, status=status.HTTP_400_BAD_REQUEST)
    
class ToggleDarkModeView(generics.UpdateAPIView):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return user.preferences

    def update(self, request, *args, **kwargs):
        preferences = self.get_object()
        preferences.dark_mode = not preferences.dark_mode
        preferences.save()
        serializer = self.get_serializer(preferences)
        return Response(serializer.data)
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login realizado com sucesso',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        token = user.create_reset_password_token()
        
        try:
            reset_url = f"{settings.FRONTEND_URL}password-reset/confirm/{token}"
            
            html_content = render_to_string('e-mail.html', {
                'user_name': user.name,
                'reset_url': reset_url,
            })
            
            msg = EmailMultiAlternatives(
                subject='🔒 Redefinição de Senha - RANKD',
                body=f'''
Olá {user.name},

Você solicitou uma redefinição de senha para sua conta do RANKD.

Acesse o link abaixo para redefinir sua senha:
{reset_url}

Este link expira em 1 hora.

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,
Equipe RANKD
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            
            return Response({
                'message': 'Email de redefinição de senha enviado com sucesso',
                'reset_url': reset_url
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Erro ao enviar email: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(reset_password_token=token)
            
            if not user.is_reset_token_valid(token):
                return Response({
                    'error': 'Token inválido ou expirado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.reset_password(new_password)
            
            return Response({
                'message': 'Senha redefinida com sucesso'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'Token inválido'
            }, status=status.HTTP_400_BAD_REQUEST)