import type { ReactElement, ReactNode } from "react";

type PanelProps = {
  title: string;
  actions: ReactNode;
  children: ReactNode;
};

const SHELL_CLASS =
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white " +
  "shadow-sm " +
  "dark:border-zinc-800 dark:bg-zinc-900";
const HEADER_CLASS =
  "flex flex-none items-center justify-between border-b border-zinc-100 px-4 py-2 " +
  "dark:border-zinc-800";
const TITLE_CLASS =
  "text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500";

export function Panel({ title, actions, children }: PanelProps): ReactElement {
  return (
    <div className={SHELL_CLASS}>
      <div className={HEADER_CLASS}>
        <span className={TITLE_CLASS}>{title}</span>
        <div className="flex items-center gap-3.5">{actions}</div>
      </div>
      {children}
    </div>
  );
}
