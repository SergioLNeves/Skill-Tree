# Skill Tree

Uma aplicação para organizar e exibir skills técnicas a partir de um repositório GitHub, com sync automático via GitHub Actions.

## Criar um novo projeto

```bash
npx create-skill-tree my-app
```

A CLI irá:

1. Clonar o projeto base limpo
2. Solicitar as variáveis de ambiente interativamente
3. Executar `pnpm install` e `pnpm sync-skills`

### Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `SKILLS_REPO` | Repositório de skills (`owner/repo`) | Sim |
| `SKILLS_BRANCH` | Branch do repositório de skills | Não (default: `main`) |
| `VITE_SKILLS_INSTALL` | Comando exibido na home para instalar skills | Não |
| `GITHUB_TOKEN` | Token GitHub para repos privados / rate limit | Não |

### Opções da CLI

```bash
npx create-skill-tree my-app --repo owner/repo --branch main --skip-install
```

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Comandos disponíveis

```bash
pnpm dev          # Dev server
pnpm build        # Build de produção (roda sync-skills antes)
pnpm sync-skills  # Sincroniza skills do repositório configurado
pnpm test         # Vitest
pnpm lint         # Biome lint
pnpm format       # Biome format
pnpm check        # Biome lint + format
```

## Sync automático de skills (GitHub Actions)

O workflow `.github/workflows/sync-skills.yml` sincroniza as skills diariamente às 3h UTC e a cada push manual.

Configure as seguintes variáveis em **Settings → Secrets and variables → Actions → Variables**:

| Variável | Valor |
|---|---|
| `SKILLS_REPO` | `owner/repo` do seu repositório de skills |
| `SKILLS_BRANCH` | Branch a sincronizar (default: `main`) |

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- [TanStack Router](https://tanstack.com/router) (file-based)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Biome](https://biomejs.dev) (lint + format)
- [Vitest](https://vitest.dev)
