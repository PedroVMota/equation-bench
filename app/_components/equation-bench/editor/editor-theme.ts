import { HighlightStyle, StreamLanguage, syntaxHighlighting } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const LATEX_LANGUAGE = StreamLanguage.define(stex);

const LATEX_HIGHLIGHT_STYLE = HighlightStyle.define([
  { tag: t.tagName, color: "var(--code-command)", fontWeight: "600" },
  { tag: t.keyword, color: "var(--code-keyword)", fontWeight: "600" },
  { tag: t.atom, color: "var(--code-keyword)" },
  { tag: t.bracket, color: "var(--code-bracket)" },
  { tag: t.punctuation, color: "var(--code-bracket)" },
  { tag: t.comment, color: "var(--code-comment)", fontStyle: "italic" },
  { tag: t.string, color: "var(--code-string)" },
  { tag: t.number, color: "var(--code-number)" },
  { tag: t.invalid, color: "var(--code-error)", textDecoration: "underline wavy" },
]);

const EDITOR_THEME = EditorView.theme({
  "&": { backgroundColor: "transparent" },
  ".cm-content": { caretColor: "var(--code-caret)", padding: "16px 4px" },
  ".cm-cursor": { borderLeftColor: "var(--code-caret)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
    backgroundColor: "var(--code-selection) !important",
  },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "var(--code-bracket)" },
  ".cm-activeLine": { backgroundColor: "transparent" },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
});

export const LATEX_EXTENSIONS: Extension[] = [
  LATEX_LANGUAGE,
  syntaxHighlighting(LATEX_HIGHLIGHT_STYLE),
  EDITOR_THEME,
  EditorView.lineWrapping,
];
