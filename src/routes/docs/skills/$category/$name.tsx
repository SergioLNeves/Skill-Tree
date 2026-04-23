import { createFileRoute, notFound } from "@tanstack/react-router";
import SkillView from "#/components/templates/skills/skill-view";
import { getSkill } from "#/lib/skills";

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
