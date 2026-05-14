import { NextRequest } from "next/server";
import { ifFetchStream } from "@/lib/interfast";
import { verifyClientToken } from "@/lib/token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return new Response("Token requis", { status: 401 });
  const verified = verifyClientToken(token);
  if (!verified.ok) return new Response("Token invalide", { status: 403 });

  const upstream = await ifFetchStream(
    `/billing/bills/${encodeURIComponent(params.id)}/pdf/facture.pdf?mode=download`,
  );
  if (!upstream.ok) return new Response("Facture introuvable", { status: upstream.status });

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/pdf",
      "Content-Disposition": `inline; filename="facture-${params.id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
