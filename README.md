# 🚀 Code Connect

Este projeto é um monorepo em pnpm com dois aplicativos:

- ⚛️ Frontend em React + Vite em `apps/web`
- 🧩 Backend em NestJS em `apps/api`

## ✅ Requisitos

- 🐳 Docker
- 🧰 Docker Compose

## 1) 🐳 Subir o ambiente com Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Isso inicia o container de desenvolvimento em Node 22 e o PostgreSQL. O banco fica disponível em `localhost:5432` e seus dados são persistidos em `.docker/postgres/`.

Antes de iniciar a API pela primeira vez, aplique as migrations:

```bash
npm run api -- db:generate
npm run api -- db:migrate:deploy
npm run api -- db:seed
```

## 2) 🧪 Acessar o container

```bash
docker compose exec app sh
```

Em seguida:

```bash
cd /usr/src/app
```

## 3) ▶️ Rodar o projeto

No diretório raiz do monorepo, use os atalhos definidos em `package.json`:

### Iniciar os dois apps juntos

```bash
npm run dev
```

### Iniciar somente o frontend

```bash
npm run web:dev
```

### Iniciar somente o backend

```bash
npm run api:dev
```

## 4) 🏗️ Build dos apps

### Frontend

```bash
npm run web:build
```

### Backend

```bash
npm run api:build
```

## 📁 Estrutura do projeto

```bash
.
├── apps/
│   ├── api/
│   └── web/
├── docker-compose.yaml
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── pnpm-lock.yaml
```

## ⚠️ Observação importante

O ambiente foi configurado usando `pnpm` com workspaces. O `package.json` raiz contém scripts que permitem executar comandos dos apps diretamente sem precisar entrar em pastas internas.

Exemplos:

```bash
npm run web:dev
npm run api:dev
npm run dev
```

## 🌐 Endereços esperados

- Frontend (Vite): `http://localhost:5173`
- Backend (NestJS): `http://localhost:3000`

O feed fica disponível publicamente em `/`. Os detalhes usam `/posts/:id`.
Visitantes podem ler posts e comentários; login é necessário para criar posts,
curtir e comentar. Os usuários demo do seed são `ada@example.com` /
`correct-horse` e `grace@example.com` / `compiler-first`.

> O frontend pode ser ajustado conforme a configuração da aplicação, mas os scripts estão prontos para uso no ambiente Docker.

## 🔐 Integração de autenticação

O frontend usa `VITE_API_URL` para localizar a API e mantém o JWT em
`localStorage`. A API aceita a origem definida em `FRONTEND_ORIGIN`, que por
padrão é `http://localhost:5173`.

Depois de subir o PostgreSQL, aplicar as migrations e iniciar a API, valide o
fluxo contra os serviços reais com:

```bash
npm run web -- test:integration
```

Esse teste registra um usuário temporário, faz login e consulta `/auth/me`.
