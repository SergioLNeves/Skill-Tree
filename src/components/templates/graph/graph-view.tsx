import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import data from "#/data/skills.json";
import { CATEGORY_COLORS } from "#/components/templates/graph/graph-canvas";
import GraphCanvas from "#/components/templates/graph/graph-canvas";
import GraphFilterPanel from "#/components/templates/graph/graph-filter-panel";
import GraphNodeTooltip from "#/components/templates/graph/graph-node-tooltip";
import { buildGraphData, computeHighlights } from "#/lib/graph-data";
import type { GraphNode } from "#/lib/graph-data";

const graphData = buildGraphData(data.items);
const allCategories = [...new Set(data.items.map((i) => i.category))];

export default function GraphView() {
	const navigate = useNavigate();

	const [activeTags, setActiveTags] = useQueryState(
		"tags",
		parseAsArrayOf(parseAsString).withDefault([]),
	);
	const [inactiveCategories, setInactiveCategories] = useQueryState(
		"hide",
		parseAsArrayOf(parseAsString).withDefault([]),
	);

	const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const activeCategories = useMemo(
		() =>
			new Set(allCategories.filter((c) => !inactiveCategories.includes(c))),
		[inactiveCategories],
	);

	const activeTagsSet = useMemo(() => new Set(activeTags), [activeTags]);

	const highlights = useMemo(
		() =>
			computeHighlights(
				graphData,
				activeCategories,
				activeTagsSet,
				hoveredNode?.id ?? null,
			),
		[activeCategories, activeTagsSet, hoveredNode],
	);

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

	function handleToggleCategory(category: string) {
		setInactiveCategories((prev) => {
			const next = new Set(prev);
			if (next.has(category)) {
				next.delete(category);
			} else {
				next.add(category);
			}
			return [...next];
		});
	}

	function handleToggleTag(tag: string) {
		setActiveTags((prev) => {
			const next = new Set(prev);
			if (next.has(tag)) {
				next.delete(tag);
			} else {
				next.add(tag);
			}
			return [...next];
		});
	}

	function handleResetFilters() {
		setActiveTags([]);
		setInactiveCategories([]);
	}

	function handleNodeHover(node: GraphNode | null, x: number, y: number) {
		setHoveredNode(node);
		if (node) setMousePos({ x, y });
	}

	function handleNodeClick(node: GraphNode) {
		navigate({
			to: "/docs/skills/$category/$name",
			params: {
				category: node.category.toLowerCase(),
				name: node.name,
			},
		});
	}

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-background">
			<GraphFilterPanel
				categories={allCategories}
				categoryCounts={categoryCounts}
				categoryColors={CATEGORY_COLORS}
				activeCategories={activeCategories}
				tags={data.metrics.tags}
				activeTags={activeTagsSet}
				onToggleCategory={handleToggleCategory}
				onToggleTag={handleToggleTag}
				onResetFilters={handleResetFilters}
			/>

			<GraphCanvas
				data={graphData}
				highlights={highlights}
				activeTags={activeTagsSet}
				onNodeHover={handleNodeHover}
				onNodeClick={handleNodeClick}
			/>

			<GraphNodeTooltip
				node={hoveredNode}
				mouseX={mousePos.x}
				mouseY={mousePos.y}
				categoryColors={CATEGORY_COLORS}
			/>
		</div>
	);
}
