import { deleteDocument, getDocument, updateDocument } from "@/lib/server/documents";
import { parsePatch } from "@/lib/server/parse-patch";

export const dynamic = "force-dynamic";

const NOT_FOUND = { error: "Not found" };

export async function GET(_request: Request, ctx: RouteContext<"/api/documents/[id]">): Promise<Response> {
  const { id } = await ctx.params;
  const doc = getDocument(id);
  return doc ? Response.json(doc) : Response.json(NOT_FOUND, { status: 404 });
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/documents/[id]">): Promise<Response> {
  const { id } = await ctx.params;
  const patch = parsePatch(await request.json().catch(() => null));
  if (!patch) return Response.json({ error: "Invalid body" }, { status: 400 });
  const doc = updateDocument(id, patch);
  return doc ? Response.json(doc) : Response.json(NOT_FOUND, { status: 404 });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/documents/[id]">): Promise<Response> {
  const { id } = await ctx.params;
  return deleteDocument(id) ? new Response(null, { status: 204 }) : Response.json(NOT_FOUND, { status: 404 });
}
