# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server (port 3000)
pnpm build      # Production build
pnpm test       # Vitest
pnpm lint       # Biome lint
pnpm format     # Biome format
pnpm check      # Biome lint + format
```

## Stack

- **Framework**: TanStack Start + React 19
- **Routing**: TanStack Router (file-based, `src/routes/`)
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york, zinc, dark mode)
- **Linter/Formatter**: Biome (double quotes, tabs)
- **Icons**: Lucide React
- **Query params**: nuqs

## Architecture

### Routing

File-based via TanStack Router. Routes live in `src/routes/`:
- `__root.tsx` — root layout (HTML shell, dark theme inject, pt-BR lang)
- `index.tsx` — home page (`/`)

`routeTree.gen.ts` is auto-generated — never edit manually.

### Component Structure

```
src/components/
  templates/home/   # Page sections (hero, install, metrics, today-pick)
  ui/               # shadcn/ui primitives
```

Templates are colocated by section: `templates/home/metrics/metrics.tsx`. Each template receives typed props and mock data lives in `src/types/`.

### Path Aliases

- `#/*` → `src/*` (primary, defined in both tsconfig and package.json `imports`)
- `@/*` → `src/*` (secondary alias)

### Styling Conventions

- `cn()` from `#/lib/utils` for conditional class merging
- CVA for component variants
- oklch() color tokens via CSS variables
- `data-slot` attributes on shadcn primitives for styling hooks
- Border radius is disabled (`radius: 0`) — don't use `rounded-*`

### shadcn/ui

Config in `components.json`. Add components with:
```bash
pnpm dlx shadcn@latest add <component>
```
Components output to `src/components/ui/`.

## Conventions

- Default exports for route/template components; named exports for UI primitives
- Props interfaces defined inline in each component file
- Mock data in `src/types/` for development, prefixed with `Mock` suffix
- `SkillItem` interface is exported from `today-pick.tsx` — reuse it when building skill routes
