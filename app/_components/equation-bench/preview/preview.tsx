import type { ReactElement } from "react";

import { ActionButton } from "../ui/action-button";
import { ErrorBox } from "../ui/error-box";
import { Panel } from "../ui/panel";

type PreviewProps = {
  html: string;
  error: string | null;
  onReset: () => void;
};

const STAGE_CLASS =
  "flex flex-1 items-center justify-center overflow-auto p-8 text-zinc-900 " +
  "dark:text-zinc-100 [&_.katex]:text-[1.5rem]";
const EMPTY_CLASS = "text-sm text-zinc-400 dark:text-zinc-600";

export function Preview({ html, error, onReset }: PreviewProps): ReactElement {
  const actions = <ActionButton onClick={onReset}>Example</ActionButton>;

  return (
    <Panel title="Rendered" actions={actions}>
      <div className={STAGE_CLASS}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <span className={EMPTY_CLASS}>Nothing to render yet.</span>
        )}
      </div>
      {error && <ErrorBox message={error} />}
    </Panel>
  );
}
