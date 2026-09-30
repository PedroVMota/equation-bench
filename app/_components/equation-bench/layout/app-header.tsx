import type { ReactElement } from "react";

const HEADER_CLASS =
  "flex flex-none items-baseline gap-3 border-b border-zinc-200 bg-white px-4 py-2 " +
  "dark:border-zinc-800 dark:bg-zinc-900";

export function AppHeader(): ReactElement {
  return (
    <header className={HEADER_CLASS}>
      <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Equation <span className="text-indigo-600 dark:text-indigo-400">Bench</span>
      </h1>
      <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
        Each line of the source becomes a step in the derivation.
      </p>
    </header>
  );
}
