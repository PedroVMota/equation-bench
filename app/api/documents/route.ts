import { createDocument, listDocuments } from "@/lib/server/documents";
import { parsePatch } from "@/lib/server/parse-patch";

export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(listDocuments());
}

export async function POST(request: Request): Promise<Response> {
  const patch = parsePatch(await request.json().catch(() => ({})));
  if (!patch) return Response.json({ error: "Invalid body" }, { status: 400 });
  return Response.json(createDocument(patch), { status: 201 });
}
