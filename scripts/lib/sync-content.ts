import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fetchRaw, type TreeNode } from "./github.ts";

const SKILLS_RE = /^skills\/\(([^)]+)\)\/(.+)$/;

export async function syncContent(tree: TreeNode[]): Promise<void> {
	const contentDir = join(process.cwd(), "src/data/skills");

	const files = tree.filter(
		(n) => n.type === "blob" && SKILLS_RE.test(n.path),
	);

	rmSync(contentDir, { recursive: true, force: true });

	await Promise.all(
		files.map(async ({ path }) => {
			const [, categorySlug, relativePath] = path.match(SKILLS_RE)!;
			const localPath = join(contentDir, categorySlug, relativePath);

			mkdirSync(join(localPath, ".."), { recursive: true });

			const res = await fetchRaw(path);
			writeFileSync(localPath, Buffer.from(await res.arrayBuffer()));
		}),
	);

	console.log(`✓ mirrored ${files.length} files → src/data/skills/`);
}
