"use client";

import { useEffect, useRef, useState } from "react";

import { fetchDocument, patchDocument } from "./documents-api";

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const AUTOSAVE_DELAY_MS = 500;

type Loaded = { id: string; source: string };
type Pending = { id: string; content: string };

export function useActiveDocument(activeId: string | null) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [status, setStatus] = useState<SaveStatus>("saved");
  const pending = useRef<Pending | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flush(): void {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const job = pending.current;
    if (!job) return;
    pending.current = null;
    setStatus("saving");
    patchDocument(job.id, { content: job.content })
      // A newer edit queued meanwhile keeps the "unsaved" state.
      .then(() => setStatus(pending.current ? "unsaved" : "saved"))
      .catch(() => setStatus("error"));
  }

  // Flush is kept in a ref so effects below always call the latest closure.
  const flushRef = useRef(flush);
  useEffect(() => {
    flushRef.current = flush;
  });

  useEffect(() => {
    if (!activeId) return;
    let isStale = false;
    fetchDocument(activeId)
      .then((doc) => {
        if (!isStale) setLoaded({ id: doc.id, source: doc.content });
      })
      .catch(() => setStatus("error"));
    return () => {
      isStale = true;
      flushRef.current(); // persist edits before leaving this document
    };
  }, [activeId]);

  useEffect(() => {
    const onHide = () => flushRef.current();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  function setSource(next: string): void {
    if (!activeId || loaded?.id !== activeId) return;
    setLoaded({ id: activeId, source: next });
    pending.current = { id: activeId, content: next };
    setStatus("unsaved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, AUTOSAVE_DELAY_MS);
  }

  const isLoading = !activeId || loaded?.id !== activeId;
  return { source: isLoading ? "" : loaded.source, isLoading, status, setSource };
}
