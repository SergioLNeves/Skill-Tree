import { createFileRoute } from "@tanstack/react-router";
import DocsSearch from "#/components/templates/docs/docs-search/docs-search";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs/")({
	component: DocsSearchPage,
});

function DocsSearchPage() {
	return <DocsSearch items={data.items as SkillItem[]} />;
}
