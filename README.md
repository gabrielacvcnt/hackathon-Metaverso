# RANKD - Gaming Analytics Platform

Sistema de analytics para jogos conectado com API Django e frontend React/TypeScript.

## 🚀 Tecnologias

### Backend
- Django 5.2.7
- Django REST Framework
- JWT Authentication
- SQLite (desenvolvimento)
- PostgreSQL (produção via Docker)
- CORS habilitado

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 16+
- npm ou bun

## 🛠️ Configuração do Projeto

### Backend (Django)

1. Navegue para a pasta do backend:
```bash
cd Backend
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute as migrações:
```bash
python manage.py migrate
```

4. Inicie o servidor:
```bash
python manage.py runserver
```

O backend estará disponível em: `http://localhost:8000`

### Frontend (React)

1. Navegue para a pasta do frontend:
```bash
cd Frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:8080`

## 🔧 Configuração da API

O frontend está configurado para se conectar automaticamente com o backend Django. A configuração pode ser encontrada em:

- **Arquivo de configuração**: `Frontend/src/lib/api.ts`
- **Variável de ambiente**: `VITE_API_BASE_URL=http://localhost:8000`

## 📡 Endpoints da API

### Autenticação
- `POST /user/create/` - Criar usuário
- `POST /user/login/` - Login
- `POST /token/refresh/` - Refresh token
- `POST /user/password-reset/` - Solicitar reset de senha
- `POST /user/password-reset/confirm/` - Confirmar reset de senha

### Usuário
- `GET /user/preferences/` - Preferências do usuário
- `PUT /user/preferences/` - Atualizar preferências
- `POST /user/toggle-dark-mode/` - Alternar modo escuro

### Gaming APIs
- `GET /Steam/Steam_Search/` - Pesquisa Steam
- `GET /Steam/Dota_Search/` - Pesquisa Dota 2
- `GET /Riot/Riot_Search/` - Pesquisa Riot Games

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Válido por 60 minutos
- **Refresh Token**: Válido por 7 dias
- **Auto-refresh**: O sistema automaticamente renova tokens expirados

## ✅ Mudanças Realizadas

### Removido Supabase
- ❌ Removida dependência `@supabase/supabase-js`
- ❌ Removida pasta `src/integrations/supabase/`
- ❌ Removidas variáveis de ambiente do Supabase

### Implementada API Django
- ✅ Criado cliente API personalizado (`src/lib/api.ts`)
- ✅ Implementado sistema de autenticação JWT
- ✅ Auto-refresh de tokens
- ✅ Tratamento de erros HTTP
- ✅ Rotas protegidas com `ProtectedRoute`

### Componentes Atualizados
- ✅ `Auth.tsx` - Conectado com API Django
- ✅ `Index.tsx` - Verificação de autenticação
- ✅ `Profile.tsx` - Dados do usuário da API
- ✅ `VerticalNav.tsx` - Logout via API
- ✅ `App.tsx` - Rotas protegidas implementadas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request