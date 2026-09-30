"use client";

import { useRef, type ReactElement } from "react";

import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";

import { AppFooter } from "./layout/app-footer";
import { AppHeader } from "./layout/app-header";
import { DocumentBar } from "./documents/document-bar";
import { Editor } from "./editor/editor";
import { EXAMPLE_SOURCE } from "./documents/example-source";
import { insertSnippet } from "./editor/insert-snippet";
import { Preview } from "./preview/preview";
import { renderLatex } from "./latex/render-latex";
import { Toolbar } from "./toolbar/toolbar";
import { useCopySource } from "./editor/use-copy-source";
import { useActiveDocument } from "./documents/use-active-document";
import { useDocumentList } from "./documents/use-document-list";

export function EquationBench(): ReactElement {
  const list = useDocumentList();
  const { source, status, setSource } = useActiveDocument(list.activeId);
  const { isCopied, copy } = useCopySource(source);
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const { html, error } = renderLatex(source);

  function handleInsert(before: string, after?: string) {
    const view = editorRef.current?.view;
    if (!view) return;
    setSource(insertSnippet(view, before, after));
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppHeader />
      <DocumentBar
        documents={list.documents}
        activeId={list.activeId}
        status={list.error ? "error" : status}
        onSelect={list.select}
        onCreate={list.create}
        onRename={list.rename}
        onDelete={list.remove}
      />
      <Toolbar onInsert={handleInsert} />
      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <Editor
          source={source}
          editorRef={editorRef}
          onChange={setSource}
          onInsert={handleInsert}
          isCopied={isCopied}
          onCopy={copy}
        />
        <Preview html={html} error={error} onReset={() => setSource(EXAMPLE_SOURCE)} />
      </main>
      <AppFooter />
    </div>
  );
}
