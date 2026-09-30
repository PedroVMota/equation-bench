import type { ReactElement } from "react";

import type { SaveStatus as Status } from "./use-active-document";

const LABELS = {
  saved: "Saved",
  unsaved: "Unsaved changes",
  saving: "Saving…",
  error: "Save failed",
} as const satisfies Record<Status, string>;

const TONES = {
  saved: "text-zinc-500 dark:text-zinc-400",
  unsaved: "text-zinc-500 dark:text-zinc-400",
  saving: "text-zinc-500 dark:text-zinc-400",
  error: "text-rose-600 dark:text-rose-400",
} as const satisfies Record<Status, string>;

export function SaveStatus({ status }: { status: Status }): ReactElement {
  return (
    <span role="status" className={`text-xs ${TONES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
