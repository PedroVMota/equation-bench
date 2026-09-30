import type { ReactElement } from "react";

import type { MathGroup } from "./toolbar-data";
import { ToolbarButton } from "./toolbar-button";

type ToolbarGroupProps = {
  group: MathGroup;
  onInsert: (before: string, after?: string) => void;
};

const LABEL_CLASS =
  "text-[10px] font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-500";

export function ToolbarGroup({ group, onInsert }: ToolbarGroupProps): ReactElement {
  return (
    <div className="flex flex-none flex-col items-center gap-1 px-3 py-1.5">
      <div className="grid grid-cols-4 gap-0.5">
        {group.buttons.map((button) => (
          <ToolbarButton key={button.key} button={button} onInsert={onInsert} />
        ))}
      </div>
      <span className={LABEL_CLASS}>{group.label}</span>
    </div>
  );
}
