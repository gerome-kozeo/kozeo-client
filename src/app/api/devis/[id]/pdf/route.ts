import { NextRequest } from "next/server";
import { devisBelongsToClient, ifFetchStream } from "@/lib/interfast";
import { verifyClientToken } from "@/lib/token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return new Response("Token requis", { status: 401 });

  const verified = verifyClientToken(token);
  if (!verified.ok) return new Response("Token invalide", { status: 403 });

  const owns = await devisBelongsToClient(params.id, verified.payload.clientId);
  if (!owns) return new Response("Accès refusé", { status: 403 });

  const upstream = await ifFetchStream(
    `/billing/quotations/${encodeURIComponent(params.id)}/pdf/devis.pdf?mode=download`,
  );
  if (!upstream.ok) return new Response("Devis introuvable", { status: upstream.status });

  const dl = req.nextUrl.searchParams.get("dl") === "1";
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/pdf",
      "Content-Disposition": `${dl ? "attachment" : "inline"}; filename="devis-${params.id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
