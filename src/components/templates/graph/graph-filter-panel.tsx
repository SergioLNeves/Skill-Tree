import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "#/components/ui/sheet";
import { useIsMobile } from "#/hooks/use-mobile";
import { cn } from "#/lib/utils";

interface GraphFilterPanelProps {
	categories: string[];
	categoryCounts: Record<string, number>;
	categoryColors: Record<string, string>;
	activeCategories: Set<string>;
	tags: string[];
	activeTags: Set<string>;
	onToggleCategory: (category: string) => void;
	onToggleTag: (tag: string) => void;
	onResetFilters: () => void;
}

function PanelContent({
	categories,
	categoryCounts,
	categoryColors,
	activeCategories,
	tags,
	activeTags,
	onToggleCategory,
	onToggleTag,
	onResetFilters,
}: GraphFilterPanelProps) {
	const hasFilters = activeCategories.size < categories.length || activeTags.size > 0;

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<div className="p-4 border-b border-border shrink-0">
				<Button variant="ghost" size="sm" className="mb-3 -ml-2 h-8" asChild>
					<Link to="/">
						<ArrowLeftIcon className="size-3.5" />
						Voltar
					</Link>
				</Button>
				<p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
					Graph View
				</p>
			</div>

			<div className="p-4 border-b border-border shrink-0">
				<p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
					Categorias
				</p>
				<div className="flex flex-col gap-1.5">
					{categories.map((cat) => {
						const active = activeCategories.has(cat);
						return (
							<button
								key={cat}
								type="button"
								onClick={() => onToggleCategory(cat)}
								className={cn(
									"flex items-center gap-2 px-2 py-1.5 text-sm font-mono transition-colors w-full text-left",
									active
										? "text-foreground"
										: "text-muted-foreground opacity-40",
								)}
							>
								<span
									className="size-2.5 shrink-0 inline-block transition-opacity"
									style={{
										backgroundColor: categoryColors[cat] ?? "oklch(0.5 0.05 0)",
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
			</div>

			<div className="p-4 flex-1 shrink-0">
				<p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase mb-3">
					Tags ({tags.length})
				</p>
				<div className="flex flex-wrap gap-1.5">
					<AnimatePresence>
						{tags.map((tag) => {
							const active = activeTags.has(tag);
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
										onClick={() => onToggleTag(tag)}
									>
										{tag}
									</Badge>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			</div>

			<div className="p-4 border-t border-border shrink-0">
				<div className="flex flex-col gap-2 mb-4">
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
						<span className="font-mono text-xs text-muted-foreground">tag</span>
					</div>
				</div>
				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-xs font-mono"
						onClick={onResetFilters}
					>
						Limpar filtros
					</Button>
				)}
			</div>
		</div>
	);
}

export default function GraphFilterPanel(props: GraphFilterPanelProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<div className="absolute top-3 left-3 z-10">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="sm">
							<MenuIcon className="size-4" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-72 p-0">
						<PanelContent {...props} />
					</SheetContent>
				</Sheet>
			</div>
		);
	}

	return (
		<div className="w-[280px] shrink-0 border-r border-border h-screen overflow-hidden">
			<PanelContent {...props} />
		</div>
	);
}
