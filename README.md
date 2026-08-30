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

Isso inicia o container de desenvolvimento em Node 22.

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

> O frontend pode ser ajustado conforme a configuração da aplicação, mas os scripts estão prontos para uso no ambiente Docker.
