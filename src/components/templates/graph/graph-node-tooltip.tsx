import { AnimatePresence, motion } from "motion/react";
import { Badge } from "#/components/ui/badge";
import type { GraphNode } from "#/lib/graph-data";

interface GraphNodeTooltipProps {
	node: GraphNode | null;
	mouseX: number;
	mouseY: number;
	categoryColors: Record<string, string>;
}

export default function GraphNodeTooltip({
	node,
	mouseX,
	mouseY,
	categoryColors,
}: GraphNodeTooltipProps) {
	return (
		<AnimatePresence>
			{node && (
				<motion.div
					key={node.id}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.1 }}
					className="fixed z-50 pointer-events-none"
					style={{
						left: mouseX + 16,
						top: mouseY + 16,
					}}
				>
					<div className="bg-card border border-border p-3 shadow-lg w-52">
						<div className="flex items-center gap-2 mb-2">
							<span
								className="size-2 shrink-0 inline-block"
								style={{
									backgroundColor:
										categoryColors[node.category] ?? "oklch(0.5 0.05 0)",
								}}
							/>
							<span className="font-mono text-sm font-semibold text-foreground truncate">
								{node.name}
							</span>
						</div>
						<p className="text-xs text-muted-foreground font-mono mb-2">
							{node.category}
						</p>
						<div className="flex flex-wrap gap-1 mb-2">
							{node.tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="text-xs">
									{tag}
								</Badge>
							))}
						</div>
						<p className="text-xs text-muted-foreground font-mono">
							{node.connections}{" "}
							{node.connections === 1 ? "conexão" : "conexões"}
						</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
