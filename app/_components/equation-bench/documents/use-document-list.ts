"use client";

import { useEffect, useState } from "react";

import type { DocumentSummary } from "@/lib/documents-types";

import { createDocument, fetchDocuments, patchDocument, removeDocument } from "./documents-api";
import { EXAMPLE_SOURCE } from "./example-source";

const ACTIVE_KEY = "equation-bench:active-document";
const LEGACY_SOURCE_KEY = "equation-bench:source";

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Blocked storage only loses the remembered selection / legacy import.
    return null;
  }
}

function rememberActive(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Selection just won't be remembered across reloads.
  }
}

async function loadInitial(): Promise<{ documents: DocumentSummary[]; activeId: string }> {
  const documents = await fetchDocuments();
  if (documents.length === 0) {
    // First run: adopt the pre-database localStorage draft so nothing is lost.
    const content = readStorage(LEGACY_SOURCE_KEY) ?? EXAMPLE_SOURCE;
    const first = await createDocument({ title: "My first document", content });
    return { documents: [first], activeId: first.id };
  }
  const remembered = readStorage(ACTIVE_KEY);
  const activeId = documents.some((doc) => doc.id === remembered) ? remembered! : documents[0].id;
  return { documents, activeId };
}

export function useDocumentList() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitial()
      .then((initial) => {
        setDocuments(initial.documents);
        setActiveId(initial.activeId);
      })
      .catch(() => setError("Could not reach the database."));
  }, []);

  function select(id: string): void {
    setActiveId(id);
    rememberActive(id);
  }

  async function create(): Promise<void> {
    const doc = await createDocument({ title: `Document ${documents.length + 1}`, content: "" });
    setDocuments((prev) => [doc, ...prev]);
    select(doc.id);
  }

  async function rename(id: string, title: string): Promise<void> {
    const saved = await patchDocument(id, { title });
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, title: saved.title } : doc)));
  }

  async function remove(id: string): Promise<void> {
    await removeDocument(id);
    const rest = documents.filter((doc) => doc.id !== id);
    if (rest.length === 0) {
      setDocuments([]);
      await create();
      return;
    }
    setDocuments(rest);
    if (id === activeId) select(rest[0].id);
  }

  return { documents, activeId, error, select, create, rename, remove };
}
