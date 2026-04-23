import { Link, useRouterState } from "@tanstack/react-router";

function useBreadcrumbItems() {
	const { location } = useRouterState();
	const segments = location.pathname.split("/").filter(Boolean);
	return segments.map((seg, i) => ({
		label: seg,
		path: `/${segments.slice(0, i + 1).join("/")}`,
		isLast: i === segments.length - 1,
	}));
}

export default function DocsBreadcrumb() {
	const items = useBreadcrumbItems();

	return (
		<nav className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
			{items.map((item, i) => (
				<span key={item.path} className="flex items-center gap-1">
					{i > 0 && <span>/</span>}
					{item.isLast ? (
						<span className="text-foreground">{item.label}</span>
					) : (
						// biome-ignore lint/suspicious/noExplicitAny: dynamic path
						<Link to={item.path as any} className="transition-colors hover:text-foreground">
							{item.label}
						</Link>
					)}
				</span>
			))}
		</nav>
	);
}
