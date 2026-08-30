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
- Follow atomic design principles: keep the UI organized in `atoms`, `molecules`, `organisms`, `templates`, and `pages`.
- Build interfaces by composing smaller pieces instead of creating large monolithic components.
- Use Tailwind CSS for styling and prefer utility-first classes over custom CSS unless there is a justified design-system need.
- Keep component responsibilities focused and avoid adding business logic to purely presentational components.
- Every component must include a test covering its essential behavior: rendering, user interaction, validation, or a critical state change.
- Prioritize behavioral assertions over snapshots or implementation details.
- Place tests next to the component or in a matching test folder structure, and keep them focused on the component's main contract.

### Backend

- Code lives under [apps/api/src](apps/api/src).
- Follow NestJS module/controller/service patterns for new features.
- The app is ESM-based and imports internal TypeScript modules using `.js` file extensions in some places, so preserve the project’s existing import style.
- Tests are under [apps/api/test](apps/api/test) and run with Vitest.
- Design the API to follow REST principles consistently: use resources as nouns, stable resource URIs, and HTTP methods for the intended action.
- Use nouns and pluralized resource names in routes, for example `/users`, `/projects`, `/users/:id`.
- Keep endpoints stateless and ensure each request carries the information needed to process it.
- Use the proper HTTP semantics for CRUD operations: GET for retrieval, POST for creation, PUT/PATCH for updates, and DELETE for removal.
- Return standard HTTP status codes and use them consistently for success, validation failures, not found, and server errors.
- Keep response payloads consistent and predictable; avoid mixing different data shapes for the same resource.
- Prefer clear resource-based naming over action-based routes such as `/createUser` or `/deleteUser`.
- Use validation and error handling at boundaries, with meaningful messages and consistent response contracts.
- Keep controllers focused on HTTP concerns, and push business logic into services.
- Prefer idempotent behavior when appropriate and avoid side effects in GET requests.

### Git and commit conventions

- Use Conventional Commits for all changes in both frontend and backend.
- Follow the pattern: `type(scope): subject`.
- Recommended types include `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, and `perf`.
- Scope should be narrow and meaningful, such as `web`, `api`, `auth`, `users`, `ui`, or `api-users`.
- Use clear, imperative subjects in the present tense, for example: `feat(web): add user card component`.
- Keep commits focused on one task or concern; avoid mixing unrelated changes in the same commit.
- Prefer descriptive messages that explain the intent of the change, not just the files modified.

## Validation

- Run the smallest relevant command for the changed app.
- For React changes, prefer frontend build/lint checks.
- For NestJS changes, prefer backend test/build checks.

## Notes

- The repo uses pnpm workspaces, but the root scripts expose a simpler npm-based workflow for daily development.
- Port expectations are documented in [README.md](README.md): frontend on `http://localhost:5173`, backend on `http://localhost:3000`.
