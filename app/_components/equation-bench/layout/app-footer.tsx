import type { ReactElement } from "react";

const FOOTER_CLASS =
  "flex-none border-t border-zinc-200 bg-white px-4 py-1.5 text-center text-[11px] " +
  "text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600";

export function AppFooter(): ReactElement {
  return (
    <footer className={FOOTER_CLASS}>
      Add <code className="font-mono">&amp;=</code> before an equals sign to align steps in a
      column. Saved automatically to the local database.
    </footer>
  );
}
