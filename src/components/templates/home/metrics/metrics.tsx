import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "#/components/ui/card";
import { Badge } from "#/components/ui/badge";

interface MetricsProps {
  skills: number;
  categories: string[];
  tags: string[];
}

export default function Metrics({
  skills,
  categories = [],
  tags = [],
}: MetricsProps) {
  return (
    <section className="hidden md:grid grid-cols-3 bg-card justify-center items-center border border-primary">
      <Card id="Skills">
        <CardHeader className="uppercase font-thin text-muted-foreground text-xs font-mono tracking-[0.2em] ">
          Skills
        </CardHeader>
        <CardContent>
          <CardTitle className="text-4xl leading line-clamp-1">
            {skills ? skills : 0}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1 mt-2 font-thin text-muted-foreground">
          This Week
        </CardFooter>
      </Card>

      <Card id="Categories" className="border-x">
        <CardHeader className="uppercase font-thin text-muted-foreground text-xs font-mono tracking-[0.2em]">
          Categories
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle className="text-4xl line-clamp-1">
            {categories.length}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex gap-1 mt-2">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </CardFooter>
      </Card>

      <Card id="Tags">
        <CardHeader className="uppercase font-thin text-muted-foreground text-xs font-mono tracking-[0.2em]">
          Tags
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <CardTitle className="text-4xl line-clamp-1">{tags.length}</CardTitle>
        </CardContent>
        <CardFooter className="flex gap-1 mt-2">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </section>
  );
}
