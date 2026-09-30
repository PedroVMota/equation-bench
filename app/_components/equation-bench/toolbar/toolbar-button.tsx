import type { ReactElement } from "react";

import type { MathButton } from "./toolbar-data";
import { ToolbarIcon } from "./toolbar-icon";

type ToolbarButtonProps = {
  button: MathButton;
  onInsert: (before: string, after?: string) => void;
};

const BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-md text-zinc-800 transition-all " +
  "hover:bg-white active:scale-95 dark:text-zinc-100 dark:hover:bg-zinc-800";

export function ToolbarButton({ button, onInsert }: ToolbarButtonProps): ReactElement {
  return (
    <button
      type="button"
      title={button.title}
      aria-label={button.title}
      onClick={() => onInsert(button.before, button.after)}
      className={BUTTON_CLASS}
    >
      <ToolbarIcon latex={button.icon} />
    </button>
  );
}
