import { fetchTree } from "./lib/github.ts";
import { syncMetadata } from "./lib/sync-metadata.ts";
import { syncContent } from "./lib/sync-content.ts";

async function main() {
	const tree = await fetchTree();
	await Promise.all([syncMetadata(tree), syncContent(tree)]);
}

main().catch((err) => {
	console.error("✗ sync failed:", err);
	process.exit(1);
});
