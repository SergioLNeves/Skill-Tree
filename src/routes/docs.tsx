import { createFileRoute, Outlet } from "@tanstack/react-router";
import DocsBreadcrumb from "#/components/templates/docs/breadcrumb/breadcrumb";
import DocsSidebar from "#/components/templates/docs/sidebar/sidebar";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	return (
		<SidebarProvider>
			<DocsSidebar
				categories={data.metrics.categories}
				items={data.items as SkillItem[]}
			/>
			<SidebarInset className="overflow-hidden">
				<header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
					<SidebarTrigger />
					<DocsBreadcrumb />
				</header>
				<div className="flex flex-1 flex-col overflow-hidden">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
