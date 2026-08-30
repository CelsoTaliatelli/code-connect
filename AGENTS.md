# AGENTS

This repo is a pnpm monorepo with two apps:

- [apps/web](apps/web): React + Vite frontend
- [apps/api](apps/api): NestJS backend with Vitest
- Root workspace scripts coordinate both apps via [package.json](package.json)

## Quick start

- Install dependencies from the repo root: `pnpm install`
- Start both apps together: `npm run dev`
- Start frontend only: `npm run web:dev`
- Start backend only: `npm run api:dev`
- Build frontend: `npm run web:build`
- Build backend: `npm run api:build`
- Docker environment: `docker compose up -d`

## Project conventions

- Keep feature work scoped to the relevant app directory; avoid mixing frontend and backend logic in the same change.
- Prefer the root package scripts for local development; they already wrap the app-specific commands.
- Use [README.md](README.md) for repo-level setup and expected ports.
- Use [apps/web/README.md](apps/web/README.md) and [apps/api/README.md](apps/api/README.md) for framework-specific conventions.

## App-specific guidance

### Frontend

- Code lives under [apps/web/src](apps/web/src).
- Default stack is React + Vite; keep components, styles, and assets local to the web app.
- Prefer small, component-oriented changes and keep state management simple unless the feature clearly requires a larger pattern.

### Backend

- Code lives under [apps/api/src](apps/api/src).
- Follow NestJS module/controller/service patterns for new features.
- The app is ESM-based and imports internal TypeScript modules using `.js` file extensions in some places, so preserve the project’s existing import style.
- Tests are under [apps/api/test](apps/api/test) and run with Vitest.

## Validation

- Run the smallest relevant command for the changed app.
- For React changes, prefer frontend build/lint checks.
- For NestJS changes, prefer backend test/build checks.

## Notes

- The repo uses pnpm workspaces, but the root scripts expose a simpler npm-based workflow for daily development.
- Port expectations are documented in [README.md](README.md): frontend on `http://localhost:5173`, backend on `http://localhost:3000`.
