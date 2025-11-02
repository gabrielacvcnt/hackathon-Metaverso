from rest_framework import serializers
from .models import User, UserPreferences
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.validators import RegexValidator
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        style={'input_type': 'password'},
        help_text="A senha deve ter pelo menos 6 caracteres"
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'confirm_password', 'name', 'preferences']
        read_only_fields = ['preferences']

    def validate_email(self, value):
        """Valida formato do email"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value

    def validate_password(self, value):
        """Valida força da senha"""
        if len(value) < 6:
            raise serializers.ValidationError("A senha deve ter pelo menos 6 caracteres.")
        
        return value

    def validate(self, attrs):
        """Valida se as senhas coincidem, quando confirm_password é fornecido"""
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        
        # Só valida confirmação se o campo foi fornecido
        if confirm_password and password != confirm_password:
            raise serializers.ValidationError("As senhas não coincidem.")
        
        return attrs

    def create(self, validated_data):
        # Remove confirm_password se existir
        validated_data.pop('confirm_password', None)
        
        # Gera username baseado no email se não fornecido
        if 'username' not in validated_data:
            email = validated_data['email']
            username = email.split('@')[0]
            # Adiciona sufixo se username já existir
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1
            validated_data['username'] = username
        
        validated_data['password'] = make_password(validated_data['password'])
        user = super().create(validated_data)
        
        UserPreferences.objects.create(user=user)
        
        return user

    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.get('password', None)
        if password:
            validated_data['password'] = make_password(password)
        return super().update(instance, validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
                if not user.check_password(password):
                    raise serializers.ValidationError('Credenciais inválidas.')
                if not user.is_active:
                    raise serializers.ValidationError('Conta de usuário desativada.')
                attrs['user'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError('Credenciais inválidas.')
        else:
            raise serializers.ValidationError('Email e senha são obrigatórios.')

        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Nenhum usuário encontrado com este email.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(
        min_length=8,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        style={'input_type': 'password'}
    )

    def validate_new_password(self, value):
        """Valida força da nova senha"""
        if len(value) < 8:
            raise serializers.ValidationError("A senha deve ter pelo menos 8 caracteres.")
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("A senha deve conter pelo menos uma letra maiúscula.")
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("A senha deve conter pelo menos uma letra minúscula.")
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError("A senha deve conter pelo menos um número.")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("A senha deve conter pelo menos um caractere especial.")
        
        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if new_password != confirm_password:
            raise serializers.ValidationError("As senhas não coincidem.")
        
        return attrs

class UserPreferencesSerializer(serializers.ModelSerializer):
    profile_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserPreferences
        fields = ['id', 'user', 'dark_mode', 'profile', 'profile_url']
        read_only_fields = ['user', 'profile_url']
    
    def get_profile_url(self, obj):
        if obj.profile:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile.url)
            return obj.profile.url
        return None