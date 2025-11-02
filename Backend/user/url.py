from django.urls import path
from .views import (
    CreateUserView, 
    UserPreferencesView, 
    UserDetailView,
    ProfileImageUploadView,
    ToggleDarkModeView, 
    LoginView,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create-user'),
    path('profile/', UserDetailView.as_view(), name='user-profile'),
    path('preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('upload-profile-image/', ProfileImageUploadView.as_view(), name='upload-profile-image'),
    path('toggle-dark-mode/', ToggleDarkModeView.as_view(), name='toggle-dark-mode'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]