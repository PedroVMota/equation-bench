import type { ReactElement } from "react";

import { MATH_GROUPS } from "./toolbar-data";
import { ToolbarGroup } from "./toolbar-group";

type ToolbarProps = {
  onInsert: (before: string, after?: string) => void;
};

const BAR_CLASS =
  "flex-none overflow-x-auto border-b border-zinc-200 bg-zinc-100 " +
  "dark:border-zinc-800 dark:bg-zinc-900/60";

export function Toolbar({ onInsert }: ToolbarProps): ReactElement {
  return (
    <div className={BAR_CLASS}>
      <div className="flex w-max divide-x divide-zinc-200 px-2 dark:divide-zinc-800">
        {MATH_GROUPS.map((group) => (
          <ToolbarGroup key={group.label} group={group} onInsert={onInsert} />
        ))}
      </div>
    </div>
  );
}
