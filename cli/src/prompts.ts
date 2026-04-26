import * as p from "@clack/prompts";

export interface EnvAnswers {
	skillsRepo: string;
	skillsBranch: string;
	viteSkillsInstall: string;
	githubToken: string;
}

export async function askProjectName(suggested: string): Promise<string> {
	const name = await p.text({
		message: "Nome do diretório do projeto:",
		placeholder: suggested,
		defaultValue: suggested,
		validate: (v) => {
			if (!v) return undefined;
			if (/[^\w\-.]/.test(v)) return "Use apenas letras, números, hífens e pontos.";
		},
	});

	if (p.isCancel(name)) {
		p.cancel("Operação cancelada.");
		process.exit(0);
	}

	return name as string;
}

export async function askEnvs(defaults: Partial<EnvAnswers>): Promise<EnvAnswers> {
	const skillsRepo = await p.text({
		message: "SKILLS_REPO (owner/repo do repositório de skills):",
		placeholder: "SergioLNeves/toolkit-agent-skills",
		defaultValue: defaults.skillsRepo,
		validate: (v) => {
			if (!v) return "SKILLS_REPO é obrigatório.";
			if (!/^[\w.-]+\/[\w.-]+$/.test(v)) return "Formato esperado: owner/repo";
		},
	});

	if (p.isCancel(skillsRepo)) {
		p.cancel("Operação cancelada.");
		process.exit(0);
	}

	const skillsBranch = await p.text({
		message: "SKILLS_BRANCH (branch do repositório de skills):",
		placeholder: "main",
		defaultValue: defaults.skillsBranch ?? "main",
	});

	if (p.isCancel(skillsBranch)) {
		p.cancel("Operação cancelada.");
		process.exit(0);
	}

	const suggestedInstall = `npx skills add ${skillsRepo as string}`;
	const viteSkillsInstall = await p.text({
		message: "VITE_SKILLS_INSTALL (comando exibido na home para instalar skills):",
		placeholder: suggestedInstall,
		defaultValue: defaults.viteSkillsInstall ?? suggestedInstall,
	});

	if (p.isCancel(viteSkillsInstall)) {
		p.cancel("Operação cancelada.");
		process.exit(0);
	}

	const githubToken = await p.password({
		message: "GITHUB_TOKEN (opcional — Enter para pular):",
		validate: () => undefined,
	});

	if (p.isCancel(githubToken)) {
		p.cancel("Operação cancelada.");
		process.exit(0);
	}

	return {
		skillsRepo: skillsRepo as string,
		skillsBranch: (skillsBranch as string) || "main",
		viteSkillsInstall: (viteSkillsInstall as string) || suggestedInstall,
		githubToken: (githubToken as string) || "",
	};
}
