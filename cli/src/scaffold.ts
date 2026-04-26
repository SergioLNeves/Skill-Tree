import { execSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { EnvAnswers } from "./prompts.js";

const REPO_URL = "https://github.com/SergioLNeves/Skill-Tree.git";

const ARTIFACTS_TO_REMOVE = [
	".git",
	".claude",
	"CLAUDE.md",
	".cta.json",
	"dist",
	".tanstack",
	"node_modules",
	"pnpm-lock.yaml",
	"tsx",
	".env",
	".env.example",
];

export function clone(targetDir: string): void {
	if (existsSync(targetDir)) {
		throw new Error(`Diretório "${targetDir}" já existe.`);
	}

	execSync(`git clone --depth=1 ${REPO_URL} "${targetDir}"`, {
		stdio: "pipe",
	});
}

export function clean(targetDir: string): void {
	for (const artifact of ARTIFACTS_TO_REMOVE) {
		const fullPath = join(targetDir, artifact);
		if (existsSync(fullPath)) {
			rmSync(fullPath, { recursive: true, force: true });
		}
	}
}

export function writeEnv(targetDir: string, envs: EnvAnswers): void {
	const lines = [
		"# Repositório GitHub de onde as skills são sincronizadas (formato: owner/repo)",
		`SKILLS_REPO=${envs.skillsRepo}`,
		"",
		"# Branch do repositório a ser usado",
		`SKILLS_BRANCH=${envs.skillsBranch}`,
		"",
		"# Comando de install exibido na home (exposto ao client via Vite)",
		`VITE_SKILLS_INSTALL=${envs.viteSkillsInstall}`,
		"",
		"# Token de autenticação do GitHub (opcional, aumenta o rate limit)",
		`GITHUB_TOKEN=${envs.githubToken}`,
		"",
	];

	writeFileSync(join(targetDir, ".env"), lines.join("\n"), "utf-8");

	const exampleLines = [
		"# Repositório GitHub de onde as skills são sincronizadas (formato: owner/repo)",
		"SKILLS_REPO=",
		"",
		"# Branch do repositório a ser usado",
		"SKILLS_BRANCH=main",
		"",
		"# Comando de install exibido na home (exposto ao client via Vite)",
		"VITE_SKILLS_INSTALL=",
		"",
		"# Token de autenticação do GitHub (opcional, aumenta o rate limit)",
		"GITHUB_TOKEN=",
		"",
	];

	writeFileSync(join(targetDir, ".env.example"), exampleLines.join("\n"), "utf-8");
}
