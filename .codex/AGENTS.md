# AGENTS.md

## Project Summary

- React 19 + TypeScript + Vite 7 web frontend.
- UI stack: Ant Design 6, `@ant-design/icons`, Tailwind CSS 4 through `@tailwindcss/vite`.
- Routing: Wouter with a central route tree in `src/Routes.tsx`.
- Data fetching: SWR with a shared object-key fetcher in `src/shared/providers/SWRConfigProvider.tsx`.
- API client: custom fetch wrapper in `src/shared/api/apiClient.ts`, plus auth retry helpers in `src/shared/api/apiClientAuthed.client.ts`.
- Types: OpenAPI-generated schemas in `src/shared/types/schema.ts`.
- State: Zustand for shared client state such as the selected business date.
- Localization: custom `LanguageProvider` with Chinese and English strings in `src/shared/translation/translations.ts`.
- Package manager: pnpm (`pnpm-lock.yaml`).

## Commands

### Install

- `pnpm install`

### Dev Server

- `pnpm dev`
- Vite serves the frontend. In development, the API base URL defaults to `http://<current-hostname>:3000` unless `VITE_API_BASE_URL` is set.

### Build And Preview

- `pnpm build`
- `pnpm preview`

### Lint And Format

- `pnpm lint`
- There is no package script for formatting. Use Prettier directly when needed, for example `pnpm exec prettier --write <files>`.

### OpenAPI Schema

- `pnpm schema`
- Generates `src/shared/types/schema.ts` from the backend OpenAPI JSON using `openapi-typescript`.
- The default schema URL is `http://<local-ip>:3000/openapi.json`.
- Override with `OPENAPI_URL`, or with `OPENAPI_PORT` / `PORT` and `OPENAPI_PATH`.
- Do not manually edit `src/shared/types/schema.ts`; it is generated automatically from the backend API documentation.

## Documentation Rules

- Always use Context7 MCP when Ant Design / antd documentation, code generation, setup, configuration, props, component APIs, or usage details are needed.
- Check `package.json` for installed versions before consulting docs.
- Do not assume Ant Design v6 props, component anatomy, or behavior from memory.
- When using or changing backend APIs, always check the local backend docs:
  - OpenAPI docs: `http://localhost:3000/openapi`
  - OpenAPI JSON: `http://localhost:3000/openapi.json`

## Code Style And Conventions

### Imports

- Use `import type` for type-only imports.
- Prefer the `@/*` alias for cross-module imports from `src`.
- Existing aliases:
  - `@/*` -> `src/*`
  - `@shared/*` -> `src/shared/*`
  - `@styles/*` -> `src/styles/*`
- Relative imports are fine for same-folder and nearby feature files.
- Follow the local import style in the file being edited.

### File Layout

- App shell and global layout live in `src/App.tsx`.
- Route definitions, sidebar metadata, and lazy page loading live in `src/Routes.tsx`.
- Feature code lives in `src/modules/<domain>/`.
- Feature pages live in `src/modules/<domain>/pages/`.
- Feature UI components live in `src/modules/<domain>/components/`.
- Feature data hooks live in `src/modules/<domain>/hooks/`.
- Feature DTOs and helpers live in `dtos/` and `utils/` inside the domain module when needed.
- Shared code lives in `src/shared/`:
  - `api/` for API clients and token helpers.
  - `components/` for app-wide UI.
  - `providers/` for React provider composition.
  - `stores/` for Zustand stores.
  - `translation/` for localization.
  - `types/` for generated and shared DTO types.
  - `utils/` for shared helpers.

### Naming

- Components: PascalCase files and exports, for example `MaterialList`.
- Hooks: `useX`, for example `useMaterialList`, `useSupplierUpdate`.
- Pages: `XPage`, for example `MaterialCreatePage`.
- DTO files: camelCase or domain-specific names ending in `.dto.ts`.
- Utilities: camelCase functions in `utils/` files.
- Keep names plain and durable. Avoid decorative words such as `Robust`, `Smart`, or `Enhanced` unless they describe a real domain concept.

## React And UI Patterns

- Use function components and React hooks.
- Use Ant Design components for forms, tables, modals, inputs, messages, date pickers, layout, and common controls.
- Use `@ant-design/icons` for iconography.
- Use Tailwind utility classes for layout and small styling adjustments, especially flex/grid/spacing/width helpers.
- Use Ant Design theme tokens through `theme.useToken()` when styling needs to align with the design system.
- Keep interface copy localized via `useTranslation()` and `translations.ts` when it is user-facing.
- UI copy is primarily Chinese with English support. Add both `zh` and `en` values for new translation keys.
- Avoid hard-coded user-facing strings unless the surrounding file already does so for the same domain.
- Keep operational screens dense, scannable, and table/form oriented. This is an inventory/procurement workflow app, not a marketing site.

## Routing

- Add pages to `src/Routes.tsx` with `lazyPage`.
- Use route metadata (`title`, `titleKey`, `icon`, `showInMenu`, `children`) consistently so sidebar and breadcrumbs continue to work.
- Navigate with Wouter APIs such as `useLocation()`.
- Use route paths that match the existing domain hierarchy, for example `/material/create` or `/procurement/receiving`.

## Data Fetching And API

- Components should consume domain hooks rather than calling `apiClient` directly.
- Read hooks usually follow `use<Entity>List` or `use<Entity>Detail`.
- Mutation hooks usually follow `use<Entity>Create`, `use<Entity>Update`, or `use<Entity>Delete` and return a `trigger` function.
- SWR keys should use the shared `SWRKey` shape:
  - `url: '/...'`
  - optional `method`
  - optional `options`
  - optional `date`
- The shared SWR fetcher supports `GET` and `POST`.
- For mutations outside SWR reads, use `apiClient` or `authedApiClient` from domain hooks.
- Except for `ApiResponseDto` and `ApiListResponseDto` in `src/shared/types/apiResponse.dto.ts`, always treat `src/shared/types/schema.ts` as the only source of truth for API DTOs and backend-derived types.
- Never change `src/shared/types/schema.ts` by hand because it is generated automatically from the backend API documentation.
- If a type in `schema.ts` does not meet the frontend functionality, inform the user instead of patching around it with duplicate local API types.
- When using backend APIs, check `http://localhost:3000/openapi` and `http://localhost:3000/openapi.json` to verify endpoints, request bodies, and response shapes.
- Wrap responses with `ApiResponseDto<T>` or `ApiListResponseDto<T>` when the backend returns the standard response envelope.
- API paths are typed as template strings beginning with `/`.
- `ApiClient` automatically appends the selected date to plain-object request bodies unless `date` is already present.
- The selected date comes from `src/shared/stores/dateStore.ts`; use `getSelectedDate()` only outside React components, and `useDateStore()` inside components.
- Keep the custom API error shape by using helpers from `src/shared/utils/api.ts` instead of ad-hoc error parsing.

## Forms, Tables, And Mutations

- Follow nearby Ant Design patterns for `Form`, `Table`, `Modal`, `Select`, `Input.Search`, `DatePicker`, `message`, and `Typography`.
- Table columns should use `ColumnsType<SchemaType>` where practical.
- Use stable `rowKey` values, usually `id`.
- After successful mutations, call the relevant SWR `mutate()` or parent callback to refresh stale data.
- Show success and error feedback with Ant Design `message`.
- Preserve existing delete/update UX unless a task explicitly asks to change it.

## Styling

- Global CSS lives in `src/global.css`.
- Tailwind v4 is imported with `@import 'tailwindcss'`; the Vite plugin is already configured.
- The Ant Design primary color is exposed as `--ant-app-color-primary` and mapped to Tailwind `--color-primary`.
- Existing print styles are important for procurement and table exports; avoid broad print CSS changes unless specifically needed.
- Use Ant Design component props and tokens first, Tailwind layout utilities second, and custom CSS only when the pattern cannot be expressed cleanly otherwise.

## PDF And Export Features

- Procurement and diet PDF/export logic currently lives in feature component helpers such as:
  - `src/modules/procurement/components/handleExportPdf.ts`
  - `src/modules/diet/components/handleExportDietPdf.ts`
- These flows use browser rendering libraries such as `html2canvas`, `jspdf`, and `jspdf-autotable`.
- Be careful with print/export layout changes; verify the rendered result when touching these files.

## TypeScript Notes

- TypeScript is strict and uses `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.
- Avoid enums, namespaces, decorators, and other syntax that conflicts with `erasableSyntaxOnly`.
- Prefer object constants with `as const` for generated or local enum-like values.
- Keep type-only imports explicit to satisfy `verbatimModuleSyntax`.

## Quality Bar

- Before handing off code changes, run the narrowest relevant validation:
  - `pnpm lint` for general changes.
  - `pnpm build` for route, type, API, or shared-provider changes.
- If a change touches UI behavior, run the Vite dev server and inspect the relevant page in the browser when practical.
- Do not introduce quick one-off fixes that bypass the existing hooks, route metadata, translation system, API client, or Ant Design conventions.
