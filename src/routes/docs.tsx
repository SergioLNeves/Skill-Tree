import { createFileRoute, Outlet } from "@tanstack/react-router";
import DocsLayout from "#/components/templates/docs/docs-layout/docs-layout";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs")({
	component: DocsPage,
});

function DocsPage() {
	return (
		<DocsLayout categories={data.metrics.categories} items={data.items}>
			<Outlet />
		</DocsLayout>
	);
}
