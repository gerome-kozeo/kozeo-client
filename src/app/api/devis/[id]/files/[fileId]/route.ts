import { NextRequest } from "next/server";
import { ifFetchStream } from "@/lib/interfast";
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

  const upstream = await ifFetchStream(
    `/billing/quotations/${encodeURIComponent(params.id)}/files/${encodeURIComponent(params.fileId)}`,
  );
  if (!upstream.ok) return new Response("Pièce jointe introuvable", { status: upstream.status });

  const filename = req.nextUrl.searchParams.get("name") || "document";
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
