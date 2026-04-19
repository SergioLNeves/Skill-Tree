import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const REPO = "SergioLNeves/toolkit-agent-skills";
const BRANCH = "main";
const SKILL_PATH_RE = /^skills\/\(([^)]+)\)\/([^/]+)\/SKILL\.md$/;

type SkillItem = {
	name: string;
	category: string;
	tags: string[];
	href: string;
};

type SkillsData = {
	metrics: { skills: number; categories: string[]; tags: string[] };
	items: SkillItem[];
};

const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const gh = (path: string) =>
	fetch(`https://api.github.com${path}`, {
		headers: {
			Accept: "application/vnd.github+json",
			...(process.env.GITHUB_TOKEN && {
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			}),
		},
	});

async function main() {
	const treeRes = await gh(
		`/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
	);
	if (!treeRes.ok) throw new Error(`tree fetch failed: ${treeRes.status}`);
	const tree = (await treeRes.json()) as {
		tree: { path: string; type: string }[];
	};

	const skillPaths = tree.tree
		.filter((n) => n.type === "blob" && SKILL_PATH_RE.test(n.path))
		.map((n) => n.path);

	const items: SkillItem[] = [];

	for (const path of skillPaths) {
		const match = path.match(SKILL_PATH_RE)!;
		const categorySlug = match[1];
		const name = match[2];
		const rawRes = await fetch(
			`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`,
		);
		if (!rawRes.ok)
			throw new Error(`raw fetch failed: ${path} ${rawRes.status}`);
		const { data } = matter(await rawRes.text());

		items.push({
			name: (data.name as string) ?? name,
			category: toTitle(categorySlug),
			tags: (data.tags as string[]) ?? [],
			href: `/skills/${categorySlug}/${name}`,
		});
	}

	const categories = [...new Set(items.map((i) => i.category))].sort();
	const tags = [...new Set(items.flatMap((i) => i.tags))].sort();

	const output: SkillsData = {
		metrics: { skills: items.length, categories, tags },
		items,
	};

	const outPath = join(process.cwd(), "src/data/skills.json");
	mkdirSync(join(process.cwd(), "src/data"), { recursive: true });
	writeFileSync(
		outPath,
		JSON.stringify(output, null, 2) + "\n",
	);

	console.log(
		`✓ synced ${items.length} skills (${categories.length} categories)`,
	);
}

main().catch((err) => {
	console.error("✗ sync failed:", err);
	process.exit(1);
});
