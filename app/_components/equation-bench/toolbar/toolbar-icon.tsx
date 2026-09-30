import type { ReactElement } from "react";

import { renderInlineLatex } from "../latex/render-latex";

type ToolbarIconProps = {
  latex: string;
};

export function ToolbarIcon({ latex }: ToolbarIconProps): ReactElement {
  return <span className="katex-icon" dangerouslySetInnerHTML={{ __html: renderInlineLatex(latex) }} />;
}
