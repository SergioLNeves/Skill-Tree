import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Skill, Tree } from "#/components/ui/logo";

export default function Hero() {
  return (
    <section className="flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="m-2 flex flex-col gap-2">
          <Skill className="md:ml-8" />
          <Tree />
        </div>

        <div className="flex flex-col gap-4 max-w-lg">
          <h1 className="text-xl md:text-4xl font-normal leading-[1.2] tracking-tighter text-center md:text-start">
            My personal toolkit. Skills I've built, refined, and carry into
            every project <br />{" "}
            <span className="text-chart-5">take what's useful</span>.
          </h1>
        </div>
      </div>

      <div className="flex flex-row justify-center mt-9 gap-3">
        <Button size="lg" asChild>
          <Link to="/docs/skills">
            Explore categories <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/docs">
            <BookOpen className="size-4" /> All skills
          </Link>
        </Button>
      </div>
    </section>
  );
}
