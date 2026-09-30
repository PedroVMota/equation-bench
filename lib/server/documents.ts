import "server-only";

import { randomUUID } from "node:crypto";

import type { DocumentPatch, DocumentSummary, SavedDocument } from "@/lib/documents-types";

import { getDatabase } from "./database";

type Row = { id: string; title: string; content: string; updated_at: number };

const DEFAULT_TITLE = "Untitled";

function toSummary(row: Omit<Row, "content">): DocumentSummary {
  return { id: row.id, title: row.title, updatedAt: row.updated_at };
}

function toDocument(row: Row): SavedDocument {
  return { ...toSummary(row), content: row.content };
}

export function listDocuments(): DocumentSummary[] {
  const rows = getDatabase()
    .prepare("SELECT id, title, updated_at FROM documents ORDER BY updated_at DESC")
    .all() as Omit<Row, "content">[];
  return rows.map(toSummary);
}

export function getDocument(id: string): SavedDocument | null {
  const row = getDatabase().prepare("SELECT * FROM documents WHERE id = ?").get(id) as Row | undefined;
  return row ? toDocument(row) : null;
}

export function createDocument(input: DocumentPatch): SavedDocument {
  const now = Date.now();
  const doc: SavedDocument = {
    id: randomUUID(),
    title: input.title?.trim() || DEFAULT_TITLE,
    content: input.content ?? "",
    updatedAt: now,
  };
  getDatabase()
    .prepare("INSERT INTO documents (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .run(doc.id, doc.title, doc.content, now, now);
  return doc;
}

export function updateDocument(id: string, patch: DocumentPatch): SavedDocument | null {
  const current = getDocument(id);
  if (!current) return null;
  const title = patch.title?.trim() || current.title;
  const content = patch.content ?? current.content;
  const now = Date.now();
  getDatabase()
    .prepare("UPDATE documents SET title = ?, content = ?, updated_at = ? WHERE id = ?")
    .run(title, content, now, id);
  return { id, title, content, updatedAt: now };
}

export function deleteDocument(id: string): boolean {
  return getDatabase().prepare("DELETE FROM documents WHERE id = ?").run(id).changes > 0;
}
