import { createFileRoute, Outlet } from "@tanstack/react-router";
import SkillsSidebar from "#/components/templates/skills/skills-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs/skills")({
	validateSearch: (
		search: Record<string, unknown>,
	): { q: string; category: string } => ({
		q: typeof search.q === "string" ? search.q : "",
		category: typeof search.category === "string" ? search.category : "",
	}),
	component: DocsSkillsLayout,
});

function DocsSkillsLayout() {
	const { q, category } = Route.useSearch();

	return (
		<SidebarProvider>
			<SkillsSidebar
				categories={data.metrics.categories}
				items={data.items}
				q={q}
				category={category}
			/>
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
					<SidebarTrigger />
					<span className="font-mono text-xs text-muted-foreground">
						docs
					</span>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
