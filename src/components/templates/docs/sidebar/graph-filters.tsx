import { AnimatePresence, motion } from "motion/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { CATEGORY_COLORS } from "#/components/templates/graph/graph-canvas";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
} from "#/components/ui/sidebar";
import data from "#/data/skills.json";
import { cn } from "#/lib/utils";

const allCategories = [...new Set(data.items.map((i) => i.category))];

export default function GraphFilters() {
	const [activeTags, setActiveTags] = useQueryState(
		"tags",
		parseAsArrayOf(parseAsString).withDefault([]),
	);
	const [inactiveCategories, setInactiveCategories] = useQueryState(
		"hide",
		parseAsArrayOf(parseAsString).withDefault([]),
	);

	const activeCategories = useMemo(
		() => new Set(allCategories.filter((c) => !inactiveCategories.includes(c))),
		[inactiveCategories],
	);
	const activeTagsSet = useMemo(() => new Set(activeTags), [activeTags]);

	const categoryCounts = useMemo(
		() =>
			allCategories.reduce(
				(acc, cat) => {
					acc[cat] = data.items.filter((i) => i.category === cat).length;
					return acc;
				},
				{} as Record<string, number>,
			),
		[],
	);

	const tags = data.metrics.tags;
	const hasFilters =
		activeCategories.size < allCategories.length || activeTagsSet.size > 0;

	function toggleCategory(category: string) {
		setInactiveCategories((prev) => {
			const next = new Set(prev);
			if (next.has(category)) next.delete(category);
			else next.add(category);
			return [...next];
		});
	}

	function toggleTag(tag: string) {
		setActiveTags((prev) => {
			const next = new Set(prev);
			if (next.has(tag)) next.delete(tag);
			else next.add(tag);
			return [...next];
		});
	}

	function resetFilters() {
		setActiveTags([]);
		setInactiveCategories([]);
	}

	return (
		<>
			<SidebarGroup>
				<SidebarGroupLabel>Categorias</SidebarGroupLabel>
				<SidebarGroupContent>
					<div className="flex flex-col gap-1.5 px-2">
						{allCategories.map((cat) => {
							const active = activeCategories.has(cat);
							return (
								<button
									key={cat}
									type="button"
									onClick={() => toggleCategory(cat)}
									className={cn(
										"flex items-center gap-2 py-1 text-sm font-mono transition-colors w-full text-left cursor-pointer",
										active
											? "text-foreground"
											: "text-muted-foreground opacity-40",
									)}
								>
									<span
										className="size-2.5 shrink-0 inline-block transition-opacity"
										style={{
											backgroundColor:
												CATEGORY_COLORS[cat] ?? "oklch(0.5 0.05 0)",
											opacity: active ? 1 : 0.3,
										}}
									/>
									<span className="flex-1">{cat}</span>
									<span className="text-xs text-muted-foreground">
										{categoryCounts[cat] ?? 0}
									</span>
								</button>
							);
						})}
					</div>
				</SidebarGroupContent>
			</SidebarGroup>

			<SidebarGroup>
				<SidebarGroupLabel>Tags ({tags.length})</SidebarGroupLabel>
				<SidebarGroupContent>
					<div className="flex flex-wrap gap-1.5 px-2">
						<AnimatePresence>
							{tags.map((tag) => {
								const active = activeTagsSet.has(tag);
								return (
									<motion.div
										key={tag}
										layout
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.1 }}
									>
										<Badge
											variant={active ? "default" : "secondary"}
											className="cursor-pointer select-none transition-all text-xs"
											onClick={() => toggleTag(tag)}
										>
											{tag}
										</Badge>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>
				</SidebarGroupContent>
			</SidebarGroup>

			<SidebarGroup className="mt-auto">
				<SidebarGroupContent>
					<div className="flex flex-col gap-2 px-2 pt-2 border-t border-border">
						<div className="flex items-center gap-2">
							<div className="h-px w-6 bg-muted-foreground/50" />
							<span className="font-mono text-xs text-muted-foreground">
								categoria
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className="h-px w-6"
								style={{
									backgroundImage:
										"repeating-linear-gradient(90deg, oklch(0.5 0.1 200) 0, oklch(0.5 0.1 200) 4px, transparent 4px, transparent 6px)",
								}}
							/>
							<span className="font-mono text-xs text-muted-foreground">
								tag
							</span>
						</div>
						{hasFilters && (
							<Button
								variant="ghost"
								size="sm"
								className="w-full text-xs font-mono mt-2"
								onClick={resetFilters}
							>
								Limpar filtros
							</Button>
						)}
					</div>
				</SidebarGroupContent>
			</SidebarGroup>
		</>
	);
}
