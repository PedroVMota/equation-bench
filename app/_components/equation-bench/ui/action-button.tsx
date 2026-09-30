import type { ReactElement, ReactNode } from "react";

type ActionButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

const ACTION_CLASS =
  "text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-600 " +
  "dark:text-zinc-400 dark:hover:text-indigo-400";

export function ActionButton({ onClick, children }: ActionButtonProps): ReactElement {
  return (
    <button type="button" onClick={onClick} className={ACTION_CLASS}>
      {children}
    </button>
  );
}
