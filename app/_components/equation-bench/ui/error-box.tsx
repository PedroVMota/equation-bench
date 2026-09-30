import type { ReactElement } from "react";

type ErrorBoxProps = {
  message: string;
};

const BOX_CLASS =
  "mx-4 mb-3 flex-none rounded-md border-l-2 border-rose-400 bg-rose-50 px-3 py-2 " +
  "font-mono text-xs leading-relaxed text-rose-600 " +
  "dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-300";

export function ErrorBox({ message }: ErrorBoxProps): ReactElement {
  return <div className={BOX_CLASS}>{message}</div>;
}
