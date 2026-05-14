import { NextRequest } from "next/server";
import { ifFetchStream, interventionBelongsToClient } from "@/lib/interfast";
import { verifyClientToken } from "@/lib/token";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; fileId: string } },
) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return new Response("Token requis", { status: 401 });

  const verified = verifyClientToken(token);
  if (!verified.ok) return new Response("Token invalide", { status: 403 });

  const owns = await interventionBelongsToClient(params.id, verified.payload.clientId);
  if (!owns) return new Response("Accès refusé", { status: 403 });

  const name = req.nextUrl.searchParams.get("name") || "document";
  const upstream = await ifFetchStream(
    `/interventions/${encodeURIComponent(params.id)}/report/files/${encodeURIComponent(params.fileId)}/content/${encodeURIComponent(name)}`,
  );
  if (!upstream.ok) {
    return new Response("Fichier introuvable", { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
