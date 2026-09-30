"use client";

import { useEffect, useRef, useState } from "react";

const COPIED_RESET_MS = 1200;

export function useCopySource(source: string): { isCopied: boolean; copy: () => Promise<void> } {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(source);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
  }

  return { isCopied, copy };
}
