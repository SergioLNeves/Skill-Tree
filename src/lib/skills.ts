import { createServerFn } from "@tanstack/react-start";
import matter from "gray-matter";

const skillFiles = import.meta.glob<string>("/src/data/skills/**/*.md", {
	query: "?raw",
	import: "default",
});

export const getSkill = createServerFn({ method: "GET" })
	.inputValidator((d: { category: string; name: string }) => d)
	.handler(async ({ data: { category, name } }) => {
		const key = `/src/data/skills/${category}/${name}/SKILL.md`;
		const loadFile = skillFiles[key];
		if (!loadFile) return null;
		const raw = await loadFile();
		const { data, content } = matter(raw);
		return {
			name: (data.name as string) ?? name,
			category,
			tags: (data.tags as string[]) ?? [],
			content,
		};
	});
