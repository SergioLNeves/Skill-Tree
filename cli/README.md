# create-skill-tree

CLI para criar um novo projeto [Skill Tree](https://github.com/SergioLNeves/Skill-Tree) pré-configurado.

## Uso

```bash
npx create-skill-tree my-app
```

Ou passando as opções via flags:

```bash
npx create-skill-tree my-app --repo SergioLNeves/toolkit-agent-skills --branch main
```

## O que faz

1. Clona o repositório base do Skill Tree
2. Remove artefatos de desenvolvimento (`.git`, `.claude/`, `CLAUDE.md`, etc.)
3. Solicita interativamente as variáveis de ambiente:
   - `SKILLS_REPO` — repositório de skills (`owner/repo`)
   - `SKILLS_BRANCH` — branch do repositório de skills (padrão: `main`)
   - `VITE_SKILLS_INSTALL` — comando exibido na home para instalar skills
   - `GITHUB_TOKEN` — token GitHub opcional (aumenta o rate limit)
4. Gera o arquivo `.env`
5. Executa `pnpm install`
6. Executa `pnpm sync-skills`

## Opções

| Flag | Descrição |
|---|---|
| `--skip-install` | Pula `pnpm install` e `pnpm sync-skills` |
| `--repo` | Define `SKILLS_REPO` sem prompt |
| `--branch` | Define `SKILLS_BRANCH` sem prompt |
| `--help` | Exibe ajuda |

## Desenvolvimento local

```bash
cd cli
pnpm install
pnpm build
node dist/index.js test-app
```

## Publicar no npm

```bash
cd cli
pnpm build
pnpm publish --access public
```
