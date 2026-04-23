import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "#/components/ui/badge";

interface SkillViewProps {
  tags: string[];
  content: string;
}

export default function SkillView({ tags, content }: SkillViewProps) {
  return (
    <div className="flex flex-col w-ful gap-8 px-4 py-10">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
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
