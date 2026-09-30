import "server-only";

import type { DocumentPatch } from "@/lib/documents-types";

const MAX_CONTENT_LENGTH = 1_000_000;
const MAX_TITLE_LENGTH = 200;

// Returns null when the body is not a valid patch; unknown fields are dropped.
export function parsePatch(body: unknown): DocumentPatch | null {
  if (typeof body !== "object" || body === null) return null;
  const { title, content } = body as Record<string, unknown>;
  const patch: DocumentPatch = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.length > MAX_TITLE_LENGTH) return null;
    patch.title = title;
  }
  if (content !== undefined) {
    if (typeof content !== "string" || content.length > MAX_CONTENT_LENGTH) return null;
    patch.content = content;
  }
  return patch;
}
