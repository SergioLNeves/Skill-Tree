import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

// @ts-ignore
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('light','dark');root.classList.add('dark');root.setAttribute('data-theme','dark');root.style.colorScheme='dark';}catch(e){}})();`;

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Skill Tree" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
        <Scripts />
      </body>
    </html>
  );
}
