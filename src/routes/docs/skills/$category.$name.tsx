import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import matter from "gray-matter";
import SkillView from "#/components/templates/skill/skill-view";

const skillFiles = import.meta.glob<string>("/src/data/skills/**/*.md", {
	query: "?raw",
	import: "default",
});

const getSkill = createServerFn({ method: "GET" })
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

export const Route = createFileRoute("/docs/skills/$category/$name")({
	loader: async ({ params }) => {
		const skill = await getSkill({ data: params });
		if (!skill) throw notFound();
		return skill;
	},
	component: SkillPage,
});

function SkillPage() {
	const skill = Route.useLoaderData();
	return <SkillView {...skill} />;
}
