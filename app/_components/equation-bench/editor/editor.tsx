"use client";

import type { ReactElement, RefObject } from "react";

import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";

import { ActionButton } from "../ui/action-button";
import { LATEX_EXTENSIONS } from "./editor-theme";
import { Panel } from "../ui/panel";

const BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: false,
  highlightActiveLineGutter: false,
  closeBrackets: true,
  autocompletion: false,
} as const;

type EditorProps = {
  source: string;
  editorRef: RefObject<ReactCodeMirrorRef | null>;
  onChange: (next: string) => void;
  onInsert: (before: string, after?: string) => void;
  isCopied: boolean;
  onCopy: () => void;
};

export function Editor({ source, editorRef, onChange, onInsert, isCopied, onCopy }: EditorProps): ReactElement {
  const actions = (
    <>
      <ActionButton onClick={() => onInsert("\n")}>New line</ActionButton>
      <ActionButton onClick={() => onInsert(" &= ")}>Align =</ActionButton>
      <ActionButton onClick={onCopy}>{isCopied ? "Copied" : "Copy"}</ActionButton>
    </>
  );

  return (
    <Panel title="Source" actions={actions}>
      <div className="min-h-0 flex-1">
        <CodeMirror
          ref={editorRef}
          value={source}
          height="100%"
          theme="none"
          basicSetup={BASIC_SETUP}
          extensions={LATEX_EXTENSIONS}
          onChange={onChange}
        />
      </div>
    </Panel>
  );
}
