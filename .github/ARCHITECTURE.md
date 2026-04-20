# Arquitetura — Skill Tree

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | TanStack Start + React 19 |
| Roteamento | TanStack Router (file-based) |
| Styling | Tailwind CSS 4 + shadcn/ui (new-york, zinc) |
| Linter/Formatter | Biome (tabs, double quotes) |
| Build | Vite 8 |
| Testes | Vitest + Testing Library |
| Deploy | Vercel (SSR via serverless function) |
| Package Manager | pnpm |

---

## Estrutura de Diretórios

```
skill-tree/
├── api/
│   └── server.js                   # Adapter Vercel: converte fetch handler → Node.js
├── scripts/
│   ├── sync-skills.ts              # Orquestrador: busca árvore e dispara fases em paralelo
│   └── lib/
│       ├── github.ts               # fetchTree(), fetchRaw(), auth via GITHUB_TOKEN
│       ├── sync-metadata.ts        # Fase 1: SKILL.md → src/data/skills.json
│       └── sync-content.ts         # Fase 2: mirror completo → src/data/skills/
├── src/
│   ├── routes/
│   │   ├── __root.tsx              # Shell HTML (dark, pt-BR, theme script)
│   │   ├── index.tsx               # Home page "/"
│   │   └── routeTree.gen.ts        # AUTO-GERADO — nunca editar manualmente
│   ├── components/
│   │   ├── templates/home/         # Seções da home (hero, install, metrics, today-pick)
│   │   └── ui/                     # shadcn/ui primitivas (badge, button, card, etc.)
│   ├── data/
│   │   ├── skills.json             # Metadata gerada pelo sync (commitada)
│   │   └── skills/                 # Mirror completo do toolkit (commitado)
│   │       ├── frontend/
│   │       └── obsidian/
│   ├── types/
│   │   └── metrics.ts              # Re-exporta metricsMock e todayPickMock do JSON
│   ├── hooks/
│   │   └── use-mobile.ts           # useIsMobile (breakpoint 768px)
│   ├── lib/
│   │   └── utils.ts                # cn() para merge de classes Tailwind
│   ├── router.tsx                  # Configuração do TanStack Router
│   └── styles.css                  # Tailwind 4 + CSS variables oklch + tema dark
├── .github/
│   └── workflows/
│       └── sync-skills.yml         # Cron diário 03:00 UTC — sync + commit automático
├── vercel.json                     # outputDirectory + rewrite /(.*) → /api/server
├── vite.config.ts
├── tsconfig.json
├── biome.json
└── components.json                 # shadcn config (new-york, zinc, lucide)
```

---

## Roteamento

File-based via TanStack Router. Cada arquivo em `src/routes/` vira uma rota.

```
src/routes/__root.tsx   → layout raiz (wraps todas as páginas)
src/routes/index.tsx    → "/"
src/routes/about.tsx    → "/about"         (exemplo futuro)
src/routes/skills/
  $category.tsx         → "/skills/:category"
  $category.$name.tsx   → "/skills/:category/:name"
```

Para adicionar uma rota: crie o arquivo e use `createFileRoute('/caminho')({ component })`. O `routeTree.gen.ts` é regenerado automaticamente.

---

## Componentes

### Exports

| Tipo | Export |
|---|---|
| Route / Template | `export default function` |
| UI primitiva | `export { Component, variants }` (named) |
| Props interface | Inline no arquivo do componente |

### Templates (`src/components/templates/home/`)

Cada template é colocado por seção. Recebe props tipadas e não gerencia estado global.

| Template | Props | Responsabilidade |
|---|---|---|
| `hero` | — | Logo + CTAs |
| `install` | — | Comando copy com feedback |
| `metrics` | `{ skills, categories[], tags[] }` | 3 cards com contagens |
| `today-pick` | `{ items: SkillItem[] }` | Lista de skills com badges |

### UI (`src/components/ui/`)

Primitivas shadcn/ui. Sempre com `data-slot` attribute para hooks de estilo.

```tsx
// Adicionando novo componente shadcn:
pnpm dlx shadcn@latest add <component>
```

---

## Dados e Sync

### Fluxo

```
toolkit-agent-skills (GitHub público)
  └── skills/(frontend)/architecture/SKILL.md
  └── skills/(obsidian)/json-canvas/SKILL.md + references/
          │
          │  pnpm sync-skills  (prebuild ou cron 24h)
          ▼
src/data/skills.json          ← metadata (name, category, tags, href)
src/data/skills/              ← conteúdo completo espelhado
  frontend/architecture/SKILL.md
  frontend/shadcn/rules/styling.md
  obsidian/json-canvas/SKILL.md
  ...
```

### Scripts

```
scripts/sync-skills.ts    orquestrador — fetchTree() → Promise.all([metadata, content])
scripts/lib/github.ts     cliente da GitHub API — auth + fetchTree + fetchRaw
scripts/lib/sync-metadata.ts  parseia frontmatter → skills.json
scripts/lib/sync-content.ts   mirror de todos os arquivos (texto + binário)
```

### Mapeamento de path

```
skills/(frontend)/shadcn/rules/styling.md
→ src/data/skills/frontend/shadcn/rules/styling.md
```

### GitHub Actions

Workflow em `.github/workflows/sync-skills.yml`:
- **Gatilho**: cron `0 3 * * *` (03:00 UTC) + `workflow_dispatch`
- Se `src/data/` mudou → commita como `github-actions[bot]` → push → redeploy Vercel

---

## Styling

- **`cn()`** de `#/lib/utils` para merge condicional de classes
- **CVA** (`class-variance-authority`) para variantes de componente
- **oklch()** color tokens via CSS variables em `src/styles.css`
- **`data-slot`** attributes nos primitivos shadcn para targeting CSS
- **`--radius: 0rem`** — border-radius desabilitado globalmente; não usar `rounded-*`
- Dark mode forçado via classe `.dark` no `<html>` (injetado por script antes do paint)

---

## Path Aliases

| Alias | Destino | Uso |
|---|---|---|
| `#/*` | `src/*` | Primário — use sempre este |
| `@/*` | `src/*` | Secundário (legado) |

Definido em `tsconfig.json` e `package.json` (`imports`).

---

## Deploy

```
pnpm build
  └── prebuild: pnpm sync-skills   ← atualiza src/data/
  └── vite build
        ├── dist/client/           ← assets estáticos (JS, CSS, favicon)
        └── dist/server/server.js  ← handler SSR (fetch-based)

Vercel:
  outputDirectory: dist/client     ← serve assets estáticos diretamente
  rewrite /(.*) → /api/server      ← rotas SSR passam pelo handler
  api/server.js                    ← bridge fetch handler → Node.js req/res
```

O `api/server.js` converte o handler fetch-style do TanStack Start (`{ fetch(Request): Response }`) para a assinatura Node.js que a Vercel espera.

---

## Convenções

- Sem comentários desnecessários — nomes auto-documentam
- Sem `rounded-*` (radius desabilitado)
- Mock data em `src/types/` com sufixo `Mock`
- `SkillItem` exportado de `today-pick.tsx` — reutilizar em rotas de skills futuras
- Commits: Conventional Commits (`feat`, `fix`, `chore`, etc.)
