import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { GraphData, GraphNode, Highlights } from "#/lib/graph-data";

const ForceGraph2D = lazy(() => import("react-force-graph-2d"));

export const CATEGORY_COLORS: Record<string, string> = {
	Frontend: "oklch(0.7 0.15 250)",
	Obsidian: "oklch(0.7 0.15 300)",
};

const FALLBACK_COLOR = "oklch(0.7 0.15 150)";

function getCategoryColor(category: string, dim = false): string {
	if (dim) {
		if (category === "Frontend") return "oklch(0.3 0.05 250)";
		if (category === "Obsidian") return "oklch(0.3 0.05 300)";
		return "oklch(0.3 0.03 0)";
	}
	return CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
}

function GraphSkeleton() {
	return (
		<div className="flex-1 flex items-center justify-center h-full">
			<span className="text-muted-foreground text-xs font-mono">
				Carregando grafo...
			</span>
		</div>
	);
}

interface GraphCanvasProps {
	data: GraphData;
	highlights: Highlights;
	activeTags: Set<string>;
	onNodeHover: (node: GraphNode | null, mouseX: number, mouseY: number) => void;
	onNodeClick: (node: GraphNode) => void;
}

export default function GraphCanvas({
	data,
	highlights,
	activeTags,
	onNodeHover,
	onNodeClick,
}: GraphCanvasProps) {
	const [mounted, setMounted] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D instance type is not exported
	const graphRef = useRef<any>(null);
	const mouseRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const ro = new ResizeObserver((entries) => {
			const rect = entries[0].contentRect;
			setDimensions({ width: rect.width, height: rect.height });
		});
		ro.observe(container);
		setDimensions({
			width: container.clientWidth,
			height: container.clientHeight,
		});
		return () => ro.disconnect();
	}, []);

	useEffect(() => {
		if (!graphRef.current || !mounted) return;
		const charge = graphRef.current.d3Force("charge");
		if (charge) charge.strength(-200);
		const link = graphRef.current.d3Force("link");
		if (link) {
			// biome-ignore lint/suspicious/noExplicitAny: d3-force link objects are untyped
			link.distance((l: any) => (l.type === "category" ? 80 : 140));
			// biome-ignore lint/suspicious/noExplicitAny: d3-force link objects are untyped
			link.strength((l: any) => (l.type === "category" ? 0.8 : 0.2));
		}
		graphRef.current.d3ReheatSimulation?.();
	}, [mounted]);

	const { highlightedNodes, dimmedNodes, highlightedLinks, dimmedLinks } =
		highlights;
	const hasFilter =
		highlightedNodes.size > 0 ||
		dimmedNodes.size > 0 ||
		highlightedLinks.size > 0 ||
		dimmedLinks.size > 0;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: canvas container tracks mouse for tooltip positioning
		<div
			ref={containerRef}
			className="flex-1 relative"
			onMouseMove={(e) => {
				mouseRef.current = { x: e.clientX, y: e.clientY };
			}}
		>
			{!mounted ? (
				<GraphSkeleton />
			) : (
				<Suspense fallback={<GraphSkeleton />}>
					<ForceGraph2D
						ref={graphRef}
						// biome-ignore lint/suspicious/noExplicitAny: GraphData extends library types with custom fields
						graphData={data as any}
						width={dimensions.width}
						height={dimensions.height}
						backgroundColor="oklch(0.12 0 0)"
						d3AlphaDecay={0.02}
						d3VelocityDecay={0.3}
						warmupTicks={100}
						cooldownTime={8000}
						nodeCanvasObjectMode={() => "replace"}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D node type is extended at runtime
						nodeCanvasObject={(node: any, ctx, globalScale) => {
							const id: string = node.id;
							const isDimmed = dimmedNodes.has(id);
							const isHighlighted = highlightedNodes.has(id);

							const baseRadius = Math.max(
								4,
								Math.min(12, 4 + (node.connections ?? 0) * 1.5),
							);
							const radius = isHighlighted ? baseRadius * 1.25 : baseRadius;
							const color = getCategoryColor(
								node.category,
								isDimmed && hasFilter,
							);
							const alpha = isDimmed && hasFilter ? 0.15 : 1;

							ctx.globalAlpha = alpha;

							if (isHighlighted) {
								ctx.shadowBlur = 14;
								ctx.shadowColor = getCategoryColor(node.category);
							}

							ctx.beginPath();
							ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
							ctx.fillStyle = color;
							ctx.fill();

							ctx.shadowBlur = 0;

							const fontSize = Math.max(7, 11 / globalScale);
							ctx.font = `${fontSize}px "Geist Mono", monospace`;
							ctx.textAlign = "center";
							ctx.textBaseline = "top";
							ctx.fillStyle =
								isDimmed && hasFilter
									? "rgba(255,255,255,0.3)"
									: "rgba(255,255,255,0.85)";
							ctx.fillText(node.name, node.x, node.y + radius + 3);

							ctx.globalAlpha = 1;
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D node type is extended at runtime
						nodePointerAreaPaint={(node: any, paintColor, ctx) => {
							const radius = Math.max(
								4,
								Math.min(12, 4 + (node.connections ?? 0) * 1.5),
							);
							ctx.fillStyle = paintColor;
							ctx.beginPath();
							ctx.arc(node.x, node.y, radius * 1.5, 0, 2 * Math.PI, false);
							ctx.fill();
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D link type is extended at runtime
						linkVisibility={(link: any) => {
							if (link.type === "tag") return activeTags.size > 0;
							return true;
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D link type is extended at runtime
						linkColor={(link: any) => {
							const isDimmed = dimmedLinks.has(link.key);
							const isHighlighted = highlightedLinks.has(link.key);

							if (link.type === "tag") {
								if (isHighlighted) return "oklch(0.72 0.14 200)";
								return "oklch(0.55 0.1 200)";
							}

							if (isDimmed && hasFilter) return "rgba(255,255,255,0.04)";
							if (isHighlighted) return "rgba(255,255,255,0.85)";
							if (hasFilter) return "rgba(255,255,255,0.35)";
							return "rgba(255,255,255,0.2)";
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D link type is extended at runtime
						linkWidth={(link: any) => {
							const isHighlighted = highlightedLinks.has(link.key);
							if (link.type === "tag") return isHighlighted ? 1.5 : 1;
							return isHighlighted ? 2.5 : 1.5;
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D link type is extended at runtime
						linkLineDash={(link: any) => (link.type === "tag" ? [3, 2] : null)}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D node type is extended at runtime
						onNodeHover={(node: any) => {
							onNodeHover(
								node ? (node as GraphNode) : null,
								mouseRef.current.x,
								mouseRef.current.y,
							);
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D node type is extended at runtime
						onNodeClick={(node: any) => {
							onNodeClick(node as GraphNode);
						}}
						// biome-ignore lint/suspicious/noExplicitAny: ForceGraph2D node type is extended at runtime
						onNodeDragEnd={(node: any) => {
							node.fx = node.x;
							node.fy = node.y;
						}}
						showPointerCursor
						enableNodeDrag
						enableZoomInteraction
						enablePanInteraction
					/>
				</Suspense>
			)}
		</div>
	);
}
