import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon, LayoutGridIcon, LayersIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "#/components/ui/sidebar";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";

interface SkillsSidebarProps {
	categories: string[];
	items: SkillItem[];
}

export default function SkillsSidebar({ categories, items }: SkillsSidebarProps) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);
	const [category] = useQueryState("category", parseAsString.withDefault(""));

	const categoryCounts = categories.reduce(
		(acc, cat) => {
			acc[cat] = items.filter((item) => item.category === cat).length;
			return acc;
		},
		{} as Record<string, number>,
	);

	function handleCategory(cat: string) {
		navigate({
			to: "/docs/skills",
			search: cat === category ? {} : { category: cat },
		});
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1">
					<LayersIcon className="size-4 text-muted-foreground" />
					<span className="font-mono text-sm font-semibold">skill-tree</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link to="/docs">
										<SearchIcon className="size-3.5" />
										<span>Busca</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={category === ""}
									onClick={() => navigate({ to: "/docs/skills", search: {} })}
								>
									<LayoutGridIcon className="size-3.5" />
									<span>Todas</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<Collapsible open={open} onOpenChange={setOpen}>
						<CollapsibleTrigger asChild>
							<SidebarGroupLabel className="cursor-pointer select-none hover:text-foreground transition-colors w-full">
								<span>Categorias</span>
								<ChevronDownIcon
									className={`ml-auto size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
								/>
							</SidebarGroupLabel>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
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
						</CollapsibleContent>
					</Collapsible>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
