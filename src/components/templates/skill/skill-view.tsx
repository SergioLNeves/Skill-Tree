import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

interface SkillViewProps {
	name: string;
	category: string;
	tags: string[];
	content: string;
}

export default function SkillView({
	name,
	category,
	tags,
	content,
}: SkillViewProps) {
	return (
		<div className="flex flex-col w-full max-w-md gap-8 px-4 py-10 mx-auto">
			<Link to="/">
				<Button variant="ghost" size="sm" className="-ml-2">
					<ArrowLeft />
					Back
				</Button>
			</Link>

			<header className="flex flex-col gap-3">
				<h1 className="text-2xl font-medium">{name}</h1>
				<div className="flex flex-wrap gap-1.5">
					<Badge variant="outline">{category}</Badge>
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
			</header>

			<article className="prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-a:text-primary prose-code:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
			</article>
		</div>
	);
}
