import type { ReactElement } from "react";

import type { DocumentSummary } from "@/lib/documents-types";

import { ActionButton } from "../ui/action-button";
import { SaveStatus } from "./save-status";
import type { SaveStatus as Status } from "./use-active-document";

const SELECT_CLASS =
  "min-w-0 max-w-64 flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm " +
  "text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

type DocumentBarProps = {
  documents: DocumentSummary[];
  activeId: string | null;
  status: Status;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

export function DocumentBar({
  documents,
  activeId,
  status,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: DocumentBarProps): ReactElement {
  const active = documents.find((doc) => doc.id === activeId);

  function handleRename() {
    if (!active) return;
    const title = window.prompt("Rename document", active.title)?.trim();
    if (title) onRename(active.id, title);
  }

  function handleDelete() {
    if (!active) return;
    if (window.confirm(`Delete "${active.title}"? This cannot be undone.`)) onDelete(active.id);
  }

  return (
    <div className="flex flex-none items-center gap-3 border-b border-zinc-200 bg-white px-4 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
      <select
        aria-label="Document"
        className={SELECT_CLASS}
        value={activeId ?? ""}
        onChange={(event) => onSelect(event.target.value)}
      >
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.title}
          </option>
        ))}
      </select>
      <ActionButton onClick={onCreate}>New</ActionButton>
      <ActionButton onClick={handleRename}>Rename</ActionButton>
      <ActionButton onClick={handleDelete}>Delete</ActionButton>
      <span className="ml-auto">
        <SaveStatus status={status} />
      </span>
    </div>
  );
}
