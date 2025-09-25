/* src/components/layout.tsx */

import { Link } from "react-router-dom";
import { HomeIcon } from "@radix-ui/react-icons";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between p-3 border-b border-tertiary/20 bg-background">
        <h1 className="text-lg font-semibold text-primary">
          Namespaced Editor
        </h1>
        <Link
          to="/"
          className="text-text-sub hover:text-primary"
          aria-label="Home"
        >
          <HomeIcon width="20" height="20" />
        </Link>
      </header>
      {children}
    </div>
  );
}
