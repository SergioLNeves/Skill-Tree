import { execSync } from "node:child_process";
import type { EnvAnswers } from "./prompts.js";

export function install(cwd: string): void {
	execSync("pnpm install", { cwd, stdio: "inherit" });
}

export function syncSkills(cwd: string, envs: EnvAnswers): void {
	execSync("pnpm sync-skills", {
		cwd,
		stdio: "inherit",
		env: {
			...process.env,
			SKILLS_REPO: envs.skillsRepo,
			SKILLS_BRANCH: envs.skillsBranch,
			VITE_SKILLS_INSTALL: envs.viteSkillsInstall,
			...(envs.githubToken ? { GITHUB_TOKEN: envs.githubToken } : {}),
		},
	});
}
