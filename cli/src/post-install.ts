import { execSync } from "node:child_process";

export function install(cwd: string): void {
	execSync("pnpm install", { cwd, stdio: "inherit" });
}

export function syncSkills(cwd: string): void {
	execSync("pnpm sync-skills", { cwd, stdio: "inherit" });
}
