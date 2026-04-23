import { createFileRoute, Link } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { Badge } from "#/components/ui/badge";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs/skills/")({
	validateSearch: (search): { category?: string; q?: string } => ({
		category: typeof search.category === "string" && search.category ? search.category : undefined,
		q: typeof search.q === "string" && search.q ? search.q : undefined,
	}),
	component: SkillsIndex,
});

function SkillsIndex() {
	const [q] = useQueryState("q", parseAsString.withDefault(""));
	const [category] = useQueryState("category", parseAsString.withDefault(""));

	const filtered = (data.items as SkillItem[]).filter((item) => {
		if (category && item.category !== category) return false;
		if (q) {
			const query = q.toLowerCase();
			return (
				item.name.toLowerCase().includes(query) ||
				item.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}
		return true;
	});

	const grouped = filtered.reduce(
		(acc, item) => {
			if (!acc[item.category]) acc[item.category] = [];
			acc[item.category].push(item);
			return acc;
		},
		{} as Record<string, SkillItem[]>,
	);

	return (
		<div className="flex flex-col gap-8 p-6">
			{Object.entries(grouped).map(([cat, skills]) => (
				<section key={cat} className="flex flex-col gap-3">
					<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						{cat}
					</h2>
					<ul className="flex flex-col divide-y divide-border">
						{skills.map((skill) => (
							<li key={skill.name}>
								<Link
									to="/docs/skills/$category/$name"
									params={{
										category: skill.category.toLowerCase(),
										name: skill.name,
									}}
									className="flex flex-col gap-1 py-3 transition-opacity hover:opacity-70 select-none"
								>
									<span className="truncate text-sm font-medium">
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
				</section>
			))}
			{filtered.length === 0 && (
				<p className="font-mono text-sm text-muted-foreground">
					nenhuma skill encontrada
				</p>
			)}
		</div>
	);
}
