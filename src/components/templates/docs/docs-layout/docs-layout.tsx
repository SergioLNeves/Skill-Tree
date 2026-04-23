import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import SkillsSidebar from "#/components/templates/skills/skills-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import DocsBreadcrumb from "../breadcrumb/breadcrumb";

interface DocsLayoutProps {
	categories: string[];
	items: SkillItem[];
	children: React.ReactNode;
}

export default function DocsLayout({
	categories,
	items,
	children,
}: DocsLayoutProps) {
	return (
		<SidebarProvider>
			<SkillsSidebar categories={categories} items={items} />
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
					<SidebarTrigger />
					<DocsBreadcrumb />
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
