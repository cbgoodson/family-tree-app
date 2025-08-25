# Repository Guidelines

## Project Structure & Modules
- `src/components/`: React components (e.g., `FamilyTree.tsx`, `Sidebar.tsx`, tests as `*.test.tsx`).
- `src/context/`: Global state (`FamilyContext.tsx`) and related tests.
- `src/types/`: Shared TypeScript types (e.g., `Person.ts`).
- `src/utils/`: Local persistence helpers (`storage.ts`).
- `public/`: Static assets served by Vite.
- `dist/`: Production build output (do not edit).
- `prototype/`: Experimental code (excluded from linting/build checks).

## Build, Test, and Development
- `npm run dev`: Start Vite dev server at `http://localhost:5173`.
- `npm run build`: Type-check and produce production build to `dist/`.
- `npm run preview`: Serve the built app locally for verification.
- `npm run lint`: Run ESLint across the repo.
- `npm run test`: Run unit tests (Vitest + Testing Library).

Examples:
```
npm install
npm run dev
npm run test -- --watch
```

## Coding Style & Naming
- Language: React 19 + TypeScript 5, Vite 7, Tailwind 4.
- Linting: ESLint (see `eslint.config.js`); `dist/` and `prototype/` are ignored.
- Indentation: 2 spaces; include semicolons; single quotes for strings.
- Components/hooks: `PascalCase` for components (`PersonCard.tsx`), `camelCase` for functions/vars, `useXxx` for hooks.
- Tests: colocate as `ComponentName.test.tsx` beside the component.

## Testing Guidelines
- Frameworks: Vitest (`jsdom`) + React Testing Library.
- Scope: component rendering, context logic, and relationship rules.
- Conventions: mock external modules like `@xyflow/react` and `src/utils/storage` when DOM/storage is not needed.
- Run focused tests: `npm run test -- src/components/Sidebar.test.tsx`.

## Commit & Pull Requests
- Commit messages: Conventional Commits style (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`) as seen in history.
- Before PR: run `npm run lint` and `npm run test`; include screenshots/GIFs for UI changes.
- PR description: problem, approach, notable decisions; link related issues.
- Keep changes scoped to `src/`; do not commit `dist/`.

## Security & Configuration
- No backend or secrets; data persists in `localStorage` via `src/utils/storage.ts`.
- Avoid adding sensitive data to the repo; environment variables are not required.

## Architecture Notes
- State: `FamilyContext` owns people and relationships with bidirectional updates.
- Views: `FamilyTree` (ReactFlow) and `TimelineView`; toggled in `App.tsx`.
- Styling: Tailwind utilities in components; global styles under `src/index.css`.
