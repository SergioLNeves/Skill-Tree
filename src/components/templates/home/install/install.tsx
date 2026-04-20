import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "#/components/ui/button";

const COMMAND = "npx skills add SergioLNeves/toolkit-agent-skills";

export default function Install() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="flex flex-col items-center gap-3">
      <p className="font-mono text-xs tracking-[0.2em]">INSTALL NOW</p>

      <Button
        aria-label="Copy command to clipboard"
        onClick={handleCopy}
        variant="secondary"
        size="lg"
        className="flex items-center justify-between gap-4 cursor-pointer"
      >
        <span className="font-mono text-sm ">
          <span className="text-secondary-foreground/60 ">$ </span>
          {COMMAND}
        </span>

        <div className="">
          {copied ? <Check className="size-4 " /> : <Copy className="size-4" />}
        </div>
      </Button>
    </section>
  );
}
