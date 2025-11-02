# 🎮 Rankd — Além da Partida

> **Dados que você entende. Evolução que você vê.**

Rankd é uma plataforma que democratiza a análise de performance gamer.  
Nosso objetivo é transformar estatísticas de jogos em **insights claros, visuais e acionáveis**, ajudando qualquer jogador a evoluir — mesmo sem patrocínio, equipe ou softwares caros.

---

## 🧩 Contexto

O universo dos e-sports cresce exponencialmente, mas o acesso a ferramentas de análise ainda é limitado.  
Enquanto times profissionais contam com estruturas completas, **jogadores independentes** precisam lidar com dados brutos e interfaces complexas.

A Rankd surge para **democratizar o acesso à análise de performance gamer**, tornando os dados **inteligíveis, acessíveis e motivadores**.

> 🎯 “Os dados estão disponíveis — o problema é que ninguém os entende.”

---

## 💡 O Problema

- 💰 Ferramentas de análise são caras e voltadas a times profissionais.  
- 📊 Interfaces priorizam volume de dados, não clareza.  
- 🎮 Jogadores amadores e streamers não têm acesso a relatórios acessíveis.  
- 🤯 Falta de feedback claro sobre desempenho individual.

---

## 🚀 Nossa Solução

**Rankd: seu espelho de performance.**

Uma plataforma acessível que transforma estatísticas de jogo em **comparativos visuais e diagnósticos automáticos**.  
O jogador conecta sua conta, e o sistema gera insights práticos sobre seus padrões e oportunidades de melhoria.

Exemplos:
- 🧩 “Você acerta 18% mais jogando à direita do mapa.”  
- ⏰ “Seu desempenho é 12% melhor entre 20h e 22h.”  
- 🔥 “Você está 30% mais consistente que na semana passada!”

---

## 🧠 Principais Funcionalidades

| Funcionalidade | Descrição |
|----------------|------------|
| 📊 **Dashboard Inteligente** | Visual limpo, métricas relevantes e comparativos automáticos. |
| ⚡ **Insights Automatizados** | Feedbacks simples baseados em regras de comparação (IF/ELSE). |
| 🎮 **Integração com APIs Públicas** | Riot API, OpenDota API, entre outras. |
| 💬 **Feedback Personalizado** | Recomendações para evoluir com base no próprio padrão de jogo. |

---

## 💻 Tecnologias Utilizadas

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router DOM

**Backend**
- Django 5.2.7
- Django REST Framework
- JWT Authentication
- SQLite (desenvolvimento)
- PostgreSQL (produção via Docker)
- CORS habilitado

**APIs e Integrações**
- Riot API  
- OpenDota API  

**📋 Pré-requisitos**

- Python 3.8+
- Node.js 16+
- npm ou bun

---

## 🎯 Público-Alvo

**“O Competitivo Amador”**

- Idade: 16 a 30 anos  
- Perfil: estudantes, criadores de conteúdo pequenos, atletas universitários e participantes de campeonatos online  
- Recursos limitados, alto engajamento  
- Desejo forte de melhorar e ser notado  

> “Eu jogo, mas não consigo enxergar meus padrões e pontos de melhoria sozinho.”

---

## 💰 Modelo de Negócio

**Freemium**  
- Base gratuita para atrair a massa de jogadores.  
- Plano pago (futuro, em reais): histórico de +3 meses, comparativos com a média do elo, planejador de treinos.

**Baixíssimo custo operacional:**  
Sem IA complexa — apenas regras e lógica aplicada a dados públicos.

---

## 💥 Impacto

| Dimensão | Impacto |
|-----------|----------|
| 🌍 Social | Democratiza acesso a dados antes restritos à elite do e-sport. |
| 🎓 Educacional | Ensina jogadores a interpretar métricas e padrões. |
| 💼 Econômico | Abre oportunidades de crescimento e visibilidade. |
| 🤝 Comunitário | Fomenta uma cultura de melhoria e aprendizado dentro dos games. |

---

## ✨ Diferenciais

| Soluções Atuais | **Rankd (Sem IA)** |
|-----------------|---------------------|
| Dados brutos e complexos | Comparativos visuais e claros |
| Linguagem técnica | Linguagem de jogador |
| Preços em dólar | Freemium e acessível em reais |
| Foco em times e analistas | Foco no jogador individual |
| Tentam prever o futuro | Ajudamos a entender o presente |

> “Queremos oferecer o que um time profissional tem — mas de forma simples e acessível.”

---

## 🧑‍💻 Equipe

| Nome | Função |
|------|---------|
| **Gabriela Cavalcante** | Product Owner / UX-UI |
| **Thiago Victor** | Desenvolvedor |
| **João Felipe** | Desenvolvedor |
| **Márcio Souto** | Desenvolvedor |
| **Fábio Hiranoyama** | Desenvolvedor |

> 💬 “Conectamos propósito e tecnologia para transformar o universo gamer.”

---

## 🏁 Conclusão

**Além da Partida**, a Rankd representa o autoconhecimento e o desenvolvimento pessoal no universo gamer.  
Ela transforma dados em **evolução**, promovendo uma nova cultura de aprendizado e prática consciente.

🎥 **Assista ao vídeo demonstrativo:**  
👉 [Link para o vídeo ou protótipo funcional](https://link-aqui.com)

---

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
