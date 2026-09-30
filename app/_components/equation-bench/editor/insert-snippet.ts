import type { EditorView } from "@codemirror/view";

export function insertSnippet(view: EditorView, before: string, after = ""): string {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const text = before + selected + after;
  const cursorPos = selected ? from + text.length : from + before.length;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: cursorPos },
    scrollIntoView: true,
  });
  view.focus();
  return view.state.doc.toString();
}
