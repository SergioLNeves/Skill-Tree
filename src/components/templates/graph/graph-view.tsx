import { useNavigate } from "@tanstack/react-router";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import GraphCanvas, {
	CATEGORY_COLORS,
} from "#/components/templates/graph/graph-canvas";
import GraphNodeTooltip from "#/components/templates/graph/graph-node-tooltip";
import data from "#/data/skills.json";
import type { GraphNode } from "#/lib/graph-data";
import { buildGraphData, computeHighlights } from "#/lib/graph-data";

const graphData = buildGraphData(data.items);
const allCategories = [...new Set(data.items.map((i) => i.category))];

export default function GraphView() {
	const navigate = useNavigate();

	const [activeTags] = useQueryState(
		"tags",
		parseAsArrayOf(parseAsString).withDefault([]),
	);
	const [inactiveCategories] = useQueryState(
		"hide",
		parseAsArrayOf(parseAsString).withDefault([]),
	);

	const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const activeCategories = useMemo(
		() => new Set(allCategories.filter((c) => !inactiveCategories.includes(c))),
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
		<div className="relative flex flex-col flex-1 overflow-hidden bg-background">
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
