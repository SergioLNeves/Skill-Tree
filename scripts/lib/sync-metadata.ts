import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { fetchRaw, type TreeNode } from "./github.ts";

const SKILL_MD_RE = /^skills\/\(([^)]+)\)\/([^/]+)\/SKILL\.md$/;

const toTitle = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function syncMetadata(tree: TreeNode[]): Promise<void> {
	const skillPaths = tree
		.filter((n) => n.type === "blob" && SKILL_MD_RE.test(n.path))
		.map((n) => n.path);

	const items = await Promise.all(
		skillPaths.map(async (path) => {
			const [, categorySlug, name] = path.match(SKILL_MD_RE)!;
			const res = await fetchRaw(path);
			const { data } = matter(await res.text());
			return {
				name: (data.name as string) ?? name,
				category: toTitle(categorySlug),
				tags: (data.tags as string[]) ?? [],
			};
		}),
	);

	const categories = [...new Set(items.map((i) => i.category))].sort();
	const tags = [...new Set(items.flatMap((i) => i.tags))].sort();

	const outPath = join(process.cwd(), "src/data/skills.json");
	mkdirSync(join(process.cwd(), "src/data"), { recursive: true });
	writeFileSync(
		outPath,
		JSON.stringify(
			{ metrics: { skills: items.length, categories, tags }, items },
			null,
			2,
		) + "\n",
	);

	console.log(`✓ synced ${items.length} skills (${categories.length} categories)`);
}
