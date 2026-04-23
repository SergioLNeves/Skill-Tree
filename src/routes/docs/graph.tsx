import { createFileRoute } from "@tanstack/react-router";
import GraphView from "#/components/templates/graph/graph-view";

export const Route = createFileRoute("/docs/graph")({
	component: GraphPage,
});

function GraphPage() {
	return <GraphView />;
}
