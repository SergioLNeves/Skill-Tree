import { Link } from "@tanstack/react-router";
import { LayersIcon, SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import { Badge } from "#/components/ui/badge";

interface DocsSearchProps {
	items: SkillItem[];
}

export default function DocsSearch({ items }: DocsSearchProps) {
	const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));

	const results =
		q.trim().length === 0
			? []
			: items.filter((item) =>
					item.name.toLowerCase().includes(q.toLowerCase()),
				);

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
			<div className="flex flex-col items-center gap-3">
				<LayersIcon className="size-10 text-muted-foreground" />
				<h1 className="font-mono text-2xl font-semibold tracking-tight">
					skill-tree
				</h1>
				<p className="font-mono text-xs text-muted-foreground">
					busque uma skill pelo nome
				</p>
			</div>

			<div className="w-full max-w-md">
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<input
						autoFocus
						type="text"
						value={q}
						onChange={(e) => setQ(e.target.value || null)}
						placeholder="ex: shadcn, react, obsidian..."
						className="w-full border border-border bg-background py-2.5 pl-9 pr-4 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-foreground"
					/>
				</div>

				{results.length > 0 && (
					<ul className="mt-1 flex flex-col divide-y divide-border border border-t-0 border-border">
						{results.map((skill) => (
							<li key={skill.name}>
								<Link
									to="/docs/skills/$category/$name"
									params={{
										category: skill.category.toLowerCase(),
										name: skill.name,
									}}
									className="flex flex-col gap-1 px-4 py-3 transition-opacity hover:opacity-70 select-none"
								>
									<span className="font-mono text-sm font-medium">
										{skill.name}
									</span>
									<div className="flex flex-wrap gap-1">
										{skill.tags.slice(0, 4).map((tag) => (
											<Badge key={tag} variant="secondary">
												{tag}
											</Badge>
										))}
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}

				{q.trim().length > 0 && results.length === 0 && (
					<p className="mt-4 text-center font-mono text-xs text-muted-foreground">
						nenhuma skill encontrada para &quot;{q}&quot;
					</p>
				)}
			</div>
		</div>
	);
}
