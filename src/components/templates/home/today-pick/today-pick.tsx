import { Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";

export interface SkillItem {
  name: string;
  tags: string[];
  category: string;
}

interface TodayPickProps {
  items: SkillItem[];
}

export default function TodayPick({ items = [] }: TodayPickProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="uppercase font-mono tracking-[0.2em] text-xs text-muted-foreground">
        Recent Adding Skills
      </h2>
      <ul className="flex flex-col divide-y divide-border">
        {items.slice(0, 10).map((item) => (
          <li key={item.name}>
            <Link
              to="/docs/skills/$category/$name"
              params={{
                category: item.category.toLowerCase(),
                name: item.name,
              }}
              className="flex flex-col gap-1 py-3 hover:opacity-70 transition-opacity select-none"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm truncate">
                  {item.name}
                </span>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {item.category}
                </Badge>
              </div>
              <div className="flex gap-1">
                {item.tags.slice(0, 3).map((tag) => (
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
  );
}
