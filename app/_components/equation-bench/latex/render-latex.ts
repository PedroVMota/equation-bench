import katex from "katex";

type RenderResult = { html: string; error: string | null };

const FALLBACK_ERROR = "Could not render this expression.";

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

export function renderLatex(source: string): RenderResult {
  if (!source.trim()) {
    return { html: "", error: null };
  }
  try {
    const html = katex.renderToString(buildSource(source), {
      displayMode: true,
      throwOnError: true,
      strict: "warn",
      trust: false,
    });
    return { html, error: null };
  } catch (err) {
    return { html: "", error: err instanceof Error ? err.message : FALLBACK_ERROR };
  }
}

export function renderInlineLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
      strict: "ignore",
    });
  } catch {
    // Icons are decorative; showing the raw LaTeX beats breaking the toolbar.
    return latex;
  }
}
