import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";

export interface GraphNode {
	id: string;
	name: string;
	category: string;
	tags: string[];
	connections: number;
}

export interface GraphLink {
	source: string;
	target: string;
	srcId: string;
	tgtId: string;
	type: "category" | "tag";
	sharedTags: string[];
	key: string;
}

export interface GraphData {
	nodes: GraphNode[];
	links: GraphLink[];
	adjacency: Map<string, Set<string>>;
	nodeLinks: Map<string, string[]>;
	linkEndpoints: Map<string, [string, string]>;
}

export interface Highlights {
	highlightedNodes: Set<string>;
	dimmedNodes: Set<string>;
	highlightedLinks: Set<string>;
	dimmedLinks: Set<string>;
}

export function buildGraphData(items: SkillItem[]): GraphData {
	const nodes: GraphNode[] = items.map((item) => ({
		id: item.name,
		name: item.name,
		category: item.category,
		tags: item.tags,
		connections: 0,
	}));

	const links: GraphLink[] = [];
	const categoryLinked = new Set<string>();

	for (let i = 0; i < items.length; i++) {
		for (let j = i + 1; j < items.length; j++) {
			if (items[i].category === items[j].category) {
				const [a, b] = [items[i].name, items[j].name].sort();
				const key = `${a}--${b}`;
				categoryLinked.add(key);
				links.push({
					source: items[i].name,
					target: items[j].name,
					srcId: items[i].name,
					tgtId: items[j].name,
					type: "category",
					sharedTags: [],
					key,
				});
			}
		}
	}

	for (let i = 0; i < items.length; i++) {
		for (let j = i + 1; j < items.length; j++) {
			const [a, b] = [items[i].name, items[j].name].sort();
			const key = `${a}--${b}`;
			if (categoryLinked.has(key)) continue;
			const sharedTags = items[i].tags.filter((t) =>
				items[j].tags.includes(t),
			);
			if (sharedTags.length > 0) {
				links.push({
					source: items[i].name,
					target: items[j].name,
					srcId: items[i].name,
					tgtId: items[j].name,
					type: "tag",
					sharedTags,
					key,
				});
			}
		}
	}

	const connCount: Record<string, number> = {};
	const nodeLinks = new Map<string, string[]>();
	const adjacency = new Map<string, Set<string>>();
	const linkEndpoints = new Map<string, [string, string]>();

	for (const item of items) {
		nodeLinks.set(item.name, []);
		adjacency.set(item.name, new Set());
	}

	for (const link of links) {
		connCount[link.srcId] = (connCount[link.srcId] || 0) + 1;
		connCount[link.tgtId] = (connCount[link.tgtId] || 0) + 1;
		nodeLinks.get(link.srcId)?.push(link.key);
		nodeLinks.get(link.tgtId)?.push(link.key);
		adjacency.get(link.srcId)?.add(link.tgtId);
		adjacency.get(link.tgtId)?.add(link.srcId);
		linkEndpoints.set(link.key, [link.srcId, link.tgtId]);
	}

	for (const node of nodes) {
		node.connections = connCount[node.id] || 0;
	}

	return { nodes, links, adjacency, nodeLinks, linkEndpoints };
}

export function computeHighlights(
	data: GraphData,
	activeCategories: Set<string>,
	activeTags: Set<string>,
	hoveredNodeId: string | null,
): Highlights {
	const allCategories = new Set(data.nodes.map((n) => n.category));
	const hasCategoryFilter = activeCategories.size < allCategories.size;
	const hasTagFilter = activeTags.size > 0;
	const hasHover = hoveredNodeId !== null;

	const highlightedNodes = new Set<string>();
	const dimmedNodes = new Set<string>();
	const highlightedLinks = new Set<string>();
	const dimmedLinks = new Set<string>();

	if (!hasTagFilter && !hasCategoryFilter && !hasHover) {
		return { highlightedNodes, dimmedNodes, highlightedLinks, dimmedLinks };
	}

	if (hasHover) {
		const id = hoveredNodeId!;
		highlightedNodes.add(id);
		const neighbors = data.adjacency.get(id) ?? new Set<string>();
		for (const neighbor of neighbors) {
			highlightedNodes.add(neighbor);
		}
		for (const linkKey of data.nodeLinks.get(id) ?? []) {
			highlightedLinks.add(linkKey);
		}
		for (const node of data.nodes) {
			if (!highlightedNodes.has(node.id)) dimmedNodes.add(node.id);
		}
		for (const [key] of data.linkEndpoints) {
			if (!highlightedLinks.has(key)) dimmedLinks.add(key);
		}
		return { highlightedNodes, dimmedNodes, highlightedLinks, dimmedLinks };
	}

	const activeNodes = new Set<string>();
	for (const node of data.nodes) {
		const catOk = !hasCategoryFilter || activeCategories.has(node.category);
		const tagOk = !hasTagFilter || node.tags.some((t) => activeTags.has(t));
		if (catOk && tagOk) {
			activeNodes.add(node.id);
		}
	}

	for (const node of data.nodes) {
		if (activeNodes.has(node.id)) {
			highlightedNodes.add(node.id);
		} else {
			dimmedNodes.add(node.id);
		}
	}

	for (const [key, [src, tgt]] of data.linkEndpoints) {
		if (activeNodes.has(src) && activeNodes.has(tgt)) {
			highlightedLinks.add(key);
		} else {
			dimmedLinks.add(key);
		}
	}

	return { highlightedNodes, dimmedNodes, highlightedLinks, dimmedLinks };
}
