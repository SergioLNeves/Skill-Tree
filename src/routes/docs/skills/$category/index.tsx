import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import type { SkillItem } from "#/components/templates/home/today-pick/today-pick";
import data from "#/data/skills.json";

export const Route = createFileRoute("/docs/skills/$category/")({
	component: CategoryIndex,
});

function CategoryIndex() {
	const { category } = Route.useParams();

	const skills = (data.items as SkillItem[]).filter(
		(item) => item.category.toLowerCase() === category.toLowerCase(),
	);

	return (
		<div className="flex flex-col gap-8 p-6">
			<section className="flex flex-col gap-3">
				<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
					{category}
				</h2>
				<ul className="flex flex-col divide-y divide-border">
					{skills.map((skill) => (
						<li key={skill.name}>
							<Link
								to="/docs/skills/$category/$name"
								params={{ category, name: skill.name }}
								className="flex flex-col gap-1 py-3 transition-opacity hover:opacity-70 select-none"
							>
								<span className="truncate text-sm font-medium">{skill.name}</span>
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
				{skills.length === 0 && (
					<p className="font-mono text-sm text-muted-foreground">
						nenhuma skill nesta categoria
					</p>
				)}
			</section>
		</div>
	);
}
