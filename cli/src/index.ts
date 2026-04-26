import { existsSync } from "node:fs";
import { resolve } from "node:path";
import * as p from "@clack/prompts";
import mri from "mri";
import pc from "picocolors";
import { install, syncSkills } from "./post-install.js";
import { askEnvs, askProjectName } from "./prompts.js";
import { clean, clone, writeEnv } from "./scaffold.js";

async function main() {
	const argv = mri(process.argv.slice(2), {
		boolean: ["skip-install", "help"],
		string: ["repo", "branch"],
		alias: { h: "help", s: "skip-install" },
	});

	if (argv.help) {
		console.log(`
${pc.bold("create-skill-tree")} — scaffold de um novo projeto Skill Tree

${pc.bold("USO")}
  npx create-skill-tree [nome-do-projeto] [opções]

${pc.bold("OPÇÕES")}
  --skip-install    Não executa pnpm install e pnpm sync-skills
  --repo            Define SKILLS_REPO (owner/repo) sem prompt
  --branch          Define SKILLS_BRANCH sem prompt
  -h, --help        Exibe esta ajuda
`);
		process.exit(0);
	}

	p.intro(pc.bgCyan(pc.black(" create-skill-tree ")));

	const suggestedName = (argv._[0] as string | undefined) || "skill-tree-app";

	let projectName: string;
	if (argv._[0]) {
		projectName = String(argv._[0]);
		if (existsSync(resolve(process.cwd(), projectName))) {
			p.cancel(`O diretório "${projectName}" já existe.`);
			process.exit(1);
		}
	} else {
		projectName = await askProjectName(suggestedName);
		if (existsSync(resolve(process.cwd(), projectName))) {
			p.cancel(`O diretório "${projectName}" já existe.`);
			process.exit(1);
		}
	}

	const envDefaults = {
		skillsRepo: argv.repo as string | undefined,
		skillsBranch: argv.branch as string | undefined,
	};

	const envs = await askEnvs(envDefaults);

	const targetDir = resolve(process.cwd(), projectName);

	const spinner = p.spinner();

	spinner.start("Clonando repositório base…");
	try {
		clone(targetDir);
	} catch (err) {
		spinner.stop("Falha ao clonar.", 1);
		p.cancel(err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
	spinner.stop("Repositório clonado.");

	spinner.start("Removendo artefatos…");
	clean(targetDir);
	spinner.stop("Projeto limpo.");

	spinner.start("Escrevendo .env…");
	writeEnv(targetDir, envs);
	spinner.stop(".env criado.");

	if (!argv["skip-install"]) {
		p.log.step("Instalando dependências (pnpm install)…");
		try {
			install(targetDir);
		} catch {
			p.log.warn("pnpm install falhou. Execute manualmente: cd " + projectName + " && pnpm install");
		}

		p.log.step("Sincronizando skills (pnpm sync-skills)…");
		try {
			syncSkills(targetDir);
		} catch {
			p.log.warn("sync-skills falhou. Execute manualmente: pnpm sync-skills");
		}
	}

	p.outro(
		[
			pc.green("✓ Projeto criado com sucesso!"),
			"",
			pc.bold("Próximos passos:"),
			`  cd ${projectName}`,
			"  pnpm dev",
		].join("\n"),
	);
}

main().catch((err) => {
	console.error(pc.red("Erro inesperado:"), err);
	process.exit(1);
});
