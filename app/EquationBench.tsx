"use client";

import katex from "katex";
import { useMemo, useRef, useState } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { StreamLanguage, HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { tags as t } from "@lezer/highlight";

const EXAMPLE = [
  "(x + 3)^2 = 25",
  "x^2 + 6x + 9 &= 25",
  "x^2 + 6x - 16 &= 0",
  "(x + 8)(x - 2) &= 0",
  "x &= -8 \\quad \\text{or} \\quad x = 2",
].join("\n");

const STORAGE_KEY = "equation-bench:source";

function loadSavedSource(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || EXAMPLE;
  } catch {
    return EXAMPLE;
  }
}

const latexLanguage = StreamLanguage.define(stex);

const latexHighlightStyle = HighlightStyle.define([
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

const editorTheme = EditorView.theme({
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

const editorExtensions = [
  latexLanguage,
  syntaxHighlighting(latexHighlightStyle),
  editorTheme,
  EditorView.lineWrapping,
];

type MathButton = {
  key: string;
  icon: string;
  before: string;
  after?: string;
  title: string;
};

type Group = {
  label: string;
  buttons: MathButton[];
};

const GROUPS: Group[] = [
  {
    label: "Structures",
    buttons: [
      { key: "frac", icon: "\\tfrac{a}{b}", before: "\\frac{", after: "}{}", title: "Fraction" },
      { key: "sqrt", icon: "\\sqrt{x}", before: "\\sqrt{", after: "}", title: "Square root" },
      { key: "nroot", icon: "\\sqrt[n]{x}", before: "\\sqrt[", after: "]{}", title: "Nth root" },
      { key: "sup", icon: "x^{2}", before: "^{", after: "}", title: "Superscript" },
      { key: "sub", icon: "x_{n}", before: "_{", after: "}", title: "Subscript" },
      { key: "sum", icon: "\\sum_{i}^{n}", before: "\\sum_{", after: "}^{}", title: "Sum" },
      { key: "int", icon: "\\int_{a}^{b}", before: "\\int_{", after: "}^{}", title: "Integral" },
      { key: "prod", icon: "\\prod_{i}^{n}", before: "\\prod_{", after: "}^{}", title: "Product" },
      { key: "lim", icon: "\\lim_{x\\to 0}", before: "\\lim_{x \\to ", after: "}", title: "Limit" },
    ],
  },
  {
    label: "Greek",
    buttons: [
      "alpha", "beta", "gamma", "delta", "epsilon", "theta", "lambda", "mu",
      "pi", "sigma", "phi", "omega", "Delta", "Sigma", "Omega",
    ].map((name) => ({
      key: name,
      icon: `\\${name}`,
      before: `\\${name} `,
      title: name,
    })),
  },
  {
    label: "Operators",
    buttons: [
      ["times", "\\times"], ["div", "\\div"], ["pm", "\\pm"], ["mp", "\\mp"],
      ["cdot", "\\cdot"], ["leq", "\\leq"], ["geq", "\\geq"], ["neq", "\\neq"],
      ["approx", "\\approx"], ["equiv", "\\equiv"], ["infty", "\\infty"],
      ["partial", "\\partial"], ["nabla", "\\nabla"],
    ].map(([key, cmd]) => ({
      key,
      icon: cmd,
      before: `${cmd} `,
      title: key,
    })),
  },
  {
    label: "Arrows",
    buttons: [
      ["to", "\\rightarrow"], ["gets", "\\leftarrow"], ["implies", "\\Rightarrow"],
      ["iff", "\\Leftrightarrow"], ["mapsto", "\\mapsto"],
    ].map(([key, cmd]) => ({
      key,
      icon: cmd,
      before: `${cmd} `,
      title: key,
    })),
  },
  {
    label: "Brackets",
    buttons: [
      { key: "parens", icon: "(x)", before: "\\left(", after: "\\right)", title: "Parentheses" },
      { key: "brackets", icon: "[x]", before: "\\left[", after: "\\right]", title: "Square brackets" },
      { key: "bars", icon: "|x|", before: "\\left|", after: "\\right|", title: "Absolute value" },
      {
        key: "matrix",
        icon: "\\left(\\begin{smallmatrix}a&b\\\\c&d\\end{smallmatrix}\\right)",
        before: "\\begin{pmatrix}\n  a & b \\\\\n  c & d\n\\end{pmatrix}",
        title: "Matrix",
      },
      {
        key: "cases",
        icon: "\\begin{cases}a\\\\b\\end{cases}",
        before: "\\begin{cases}\n  & \\text{if } \\\\\n  & \\text{otherwise}\n\\end{cases}",
        title: "Piecewise",
      },
    ],
  },
  {
    label: "Accents",
    buttons: [
      { key: "hat", icon: "\\hat{a}", before: "\\hat{", after: "}", title: "Hat" },
      { key: "bar", icon: "\\bar{a}", before: "\\bar{", after: "}", title: "Bar" },
      { key: "vec", icon: "\\vec{a}", before: "\\vec{", after: "}", title: "Vector" },
      { key: "dot", icon: "\\dot{a}", before: "\\dot{", after: "}", title: "Dot" },
      { key: "tilde", icon: "\\tilde{a}", before: "\\tilde{", after: "}", title: "Tilde" },
    ],
  },
];

function MathIcon({ latex }: { latex: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false,
        strict: "ignore",
      });
    } catch {
      return latex;
    }
  }, [latex]);
  return <span className="katex-icon" dangerouslySetInnerHTML={{ __html: html }} />;
}

function buildSource(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  while (lines.length > 1 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }
  if (lines.length <= 1) {
    return lines[0] ?? "";
  }
  return `\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}`;
}

export default function EquationBench() {
  const [source, setSource] = useState(loadSavedSource);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  function persist(next: string) {
    setSource(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — nothing we can do if storage is unavailable
    }
  }

  const { html, error } = useMemo(() => {
    const trimmed = source.trim();
    if (!trimmed) {
      return { html: "", error: null as string | null };
    }
    try {
      const rendered = katex.renderToString(buildSource(source), {
        displayMode: true,
        throwOnError: true,
        strict: "warn",
        trust: false,
      });
      return { html: rendered, error: null as string | null };
    } catch (err) {
      return {
        html: "",
        error: err instanceof Error ? err.message : "Could not render this expression.",
      };
    }
  }, [source]);

  function insertSnippet(before: string, after = "") {
    const view = editorRef.current?.view;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    const selected = view.state.sliceDoc(from, to);
    const text = before + selected + after;
    const cursorPos = selected ? from + text.length : from + before.length;
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: cursorPos },
      scrollIntoView: true,
    });
    persist(view.state.doc.toString());
    view.focus();
  }

  const [copied, setCopied] = useState(false);
  async function copySource() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    setTimeout(() => setCopied(false), 1200);
  }

  const actionLink =
    "text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400";

  return (
    <div className="flex h-dvh w-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex flex-none items-baseline gap-3 border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Equation <span className="text-indigo-600 dark:text-indigo-400">Bench</span>
        </h1>
        <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
          Each line of the source becomes a step in the derivation.
        </p>
      </header>

      <div className="flex-none overflow-x-auto border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex w-max divide-x divide-zinc-200 px-2 dark:divide-zinc-800">
          {GROUPS.map((g) => (
            <div key={g.label} className="flex flex-none flex-col items-center gap-1 px-3 py-1.5">
              <div className="grid grid-cols-4 gap-0.5">
                {g.buttons.map((btn) => (
                  <button
                    key={btn.key}
                    type="button"
                    title={btn.title}
                    aria-label={btn.title}
                    onClick={() => insertSnippet(btn.before, btn.after)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-800 transition-all hover:bg-white active:scale-95 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <MathIcon latex={btn.icon} />
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-none items-center justify-between border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
            <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
              Source
            </span>
            <div className="flex items-center gap-3.5">
              <button type="button" onClick={() => insertSnippet("\n")} className={actionLink}>
                New line
              </button>
              <button type="button" onClick={() => insertSnippet(" &= ")} className={actionLink}>
                Align =
              </button>
              <button type="button" onClick={copySource} className={actionLink}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <CodeMirror
              ref={editorRef}
              value={source}
              height="100%"
              theme="none"
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: false,
                highlightActiveLineGutter: false,
                closeBrackets: true,
                autocompletion: false,
              }}
              extensions={editorExtensions}
              onChange={(value) => persist(value)}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-none items-center justify-between border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
            <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase dark:text-zinc-500">
              Rendered
            </span>
            <button type="button" onClick={() => persist(EXAMPLE)} className={actionLink}>
              Example
            </button>
          </div>
          <div className="preview-body flex flex-1 items-center justify-center overflow-auto p-8 text-zinc-900 dark:text-zinc-100">
            {html ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <span className="text-sm text-zinc-400 dark:text-zinc-600">
                Nothing to render yet.
              </span>
            )}
          </div>
          {error && (
            <div className="mono mx-4 mb-3 flex-none rounded-md border-l-2 border-rose-400 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-600 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}
        </div>
      </main>

      <footer className="flex-none border-t border-zinc-200 bg-white px-4 py-1.5 text-center text-[11px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600">
        Add <code className="mono">&amp;=</code> before an equals sign to align steps in a column.
        Saved automatically in this browser.
      </footer>
    </div>
  );
}
