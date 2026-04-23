import { Link, useRouterState } from "@tanstack/react-router";
import {
	ChevronDownIcon,
	LayersIcon,
	LayoutGridIcon,
	NetworkIcon,
	SearchIcon,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import GraphFilters from "#/components/templates/docs/sidebar/graph-filters";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
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

interface DocsSidebarProps {
	categories: string[];
	items: SkillItem[];
}

export default function DocsSidebar({ categories, items }: DocsSidebarProps) {
	const [open, setOpen] = useState(true);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [category] = useQueryState("category", parseAsString.withDefault(""));

	const isGraph = pathname === "/docs/graph";

	const categoryCounts = categories.reduce(
		(acc, cat) => {
			acc[cat] = items.filter((item) => item.category === cat).length;
			return acc;
		},
		{} as Record<string, number>,
	);

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
								<SidebarMenuButton
									asChild
									isActive={pathname === "/docs" || pathname === "/docs/"}
								>
									<Link to="/docs">
										<SearchIcon className="size-3.5" />
										<span>Busca</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname.startsWith("/docs/skills")}
								>
									<Link to="/docs/skills">
										<LayoutGridIcon className="size-3.5" />
										<span>Todas</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isGraph}>
									<Link to="/docs/graph">
										<NetworkIcon className="size-3.5" />
										<span>Graph</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{isGraph ? (
					<GraphFilters />
				) : (
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
												<SidebarMenuButton asChild isActive={category === cat}>
													<Link to="/docs/skills" search={{ category: cat }}>
														<span>{cat}</span>
														<SidebarMenuBadge>
															{categoryCounts[cat]}
														</SidebarMenuBadge>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</Collapsible>
					</SidebarGroup>
				)}
			</SidebarContent>
		</Sidebar>
	);
}
