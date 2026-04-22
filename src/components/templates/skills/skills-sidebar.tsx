import { useNavigate } from "@tanstack/react-router";
import { LayersIcon, SearchIcon } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";

interface SkillsSidebarProps {
	categories: string[];
	items: SkillItem[];
	q: string;
	category: string;
}

export default function SkillsSidebar({
	categories,
	items,
	q,
	category,
}: SkillsSidebarProps) {
	const navigate = useNavigate();

	const categoryCounts = categories.reduce(
		(acc, cat) => {
			acc[cat] = items.filter((item) => item.category === cat).length;
			return acc;
		},
		{} as Record<string, number>,
	);

	function handleSearch(value: string) {
		navigate({ to: "/skills", search: { q: value, category } });
	}

	function handleCategory(cat: string) {
		navigate({
			to: "/skills",
			search: { q: "", category: cat === category ? "" : cat },
		});
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1">
					<LayersIcon className="size-4 text-muted-foreground" />
					<span className="font-mono text-sm font-semibold">skill-tree</span>
				</div>
				<div className="relative">
					<SearchIcon className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
					<SidebarInput
						placeholder="buscar skill..."
						value={q}
						onChange={(e) => handleSearch(e.target.value)}
						className="pl-8"
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Categorias</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={category === ""}
									onClick={() => handleCategory("")}
								>
									<span>Todas</span>
									<SidebarMenuBadge>{items.length}</SidebarMenuBadge>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{categories.map((cat) => (
								<SidebarMenuItem key={cat}>
									<SidebarMenuButton
										isActive={category === cat}
										onClick={() => handleCategory(cat)}
									>
										<span>{cat}</span>
										<SidebarMenuBadge>{categoryCounts[cat]}</SidebarMenuBadge>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
