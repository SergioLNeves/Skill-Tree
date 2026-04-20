export const REPO = "SergioLNeves/toolkit-agent-skills";
export const BRANCH = "main";

export type TreeNode = { path: string; type: string };

const authHeaders = (): HeadersInit =>
	process.env.GITHUB_TOKEN
		? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
		: {};

export async function fetchTree(): Promise<TreeNode[]> {
	const res = await fetch(
		`https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`,
		{
			headers: {
				Accept: "application/vnd.github+json",
				...authHeaders(),
			},
		},
	);
	if (!res.ok) throw new Error(`tree fetch failed: ${res.status}`);
	const data = (await res.json()) as { tree: TreeNode[] };
	return data.tree;
}

export async function fetchRaw(path: string): Promise<Response> {
	const res = await fetch(
		`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`,
		{ headers: authHeaders() },
	);
	if (!res.ok) throw new Error(`raw fetch failed: ${path} ${res.status}`);
	return res;
}
