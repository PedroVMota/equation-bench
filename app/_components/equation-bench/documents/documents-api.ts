import type { DocumentPatch, DocumentSummary, SavedDocument } from "@/lib/documents-types";

const BASE_URL = "/api/documents";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${init?.method ?? "GET"} ${url} failed: ${response.status}`);
  return (response.status === 204 ? undefined : await response.json()) as T;
}

function jsonInit(method: string, body: DocumentPatch): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export function fetchDocuments(): Promise<DocumentSummary[]> {
  return request(BASE_URL);
}

export function fetchDocument(id: string): Promise<SavedDocument> {
  return request(`${BASE_URL}/${id}`);
}

export function createDocument(input: DocumentPatch): Promise<SavedDocument> {
  return request(BASE_URL, jsonInit("POST", input));
}

// keepalive lets the request finish while the tab is closing.
export function patchDocument(id: string, patch: DocumentPatch): Promise<SavedDocument> {
  return request(`${BASE_URL}/${id}`, { ...jsonInit("PATCH", patch), keepalive: true });
}

export function removeDocument(id: string): Promise<void> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}
