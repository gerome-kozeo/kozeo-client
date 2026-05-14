import { Card, CardContent } from "@/components/ui/card";
import { PdfPreview } from "@/components/pdf-preview";
import { Section } from "@/components/ui/section";
import type { Devis } from "@/lib/types";
import { cn, formatDateShort, formatEUR } from "@/lib/utils";

const STATUS_BADGE: Record<Devis["status"], { label: string; className: string; dot: string }> = {
  draft: { label: "Brouillon", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15", dot: "bg-kozeo-violet/40" },
  finalized: { label: "Finalisé", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15", dot: "bg-kozeo-violet/40" },
  sent: { label: "À signer", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30", dot: "bg-kozeo-orange" },
  signed: { label: "Signé", className: "bg-kozeo-vert-accent/15 text-kozeo-vert-dark border-kozeo-vert-accent/40", dot: "bg-kozeo-vert-accent" },
  canceled: { label: "Annulé", className: "bg-kozeo-violet/5 text-kozeo-violet/40 border-kozeo-violet/15", dot: "bg-kozeo-violet/30" },
  refused: { label: "Refusé", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30", dot: "bg-kozeo-orange" },
  paid: { label: "Réglé", className: "bg-kozeo-vert/15 text-kozeo-vert-dark border-kozeo-vert/40", dot: "bg-kozeo-vert" },
  unknown: { label: "—", className: "bg-kozeo-violet/5 text-kozeo-violet/50 border-kozeo-violet/15", dot: "bg-kozeo-violet/30" },
};

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function DevisList({ devis, token }: { devis: Devis[]; token: string }) {
  if (devis.length === 0) {
    return (
      <Section title="Vos devis" eyebrow="Documents">
        <Card>
          <CardContent>
            <p className="text-sm text-kozeo-violet/60">Aucun devis pour le moment.</p>
          </CardContent>
        </Card>
      </Section>
    );
  }

  return (
    <Section title="Vos devis" eyebrow="Documents">
      <ul className="flex flex-col gap-3">
        {devis.map((d) => {
          const badge = STATUS_BADGE[d.status];
          const acompteEur = d.acomptePct ? (d.totalTTC * d.acomptePct) / 100 : null;
          return (
            <li key={d.id}>
              <Card>
                <CardContent className="flex flex-col gap-4 pt-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                        Devis {d.ref}
                      </span>
                      <h3 className="text-base font-semibold text-kozeo-violet">{d.name}</h3>
                      <p className="text-sm text-kozeo-violet/60">
                        Émis le {formatDateShort(d.createdAt)}
                        {d.signedAt ? <> · signé le {formatDateShort(d.signedAt)}</> : null}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 self-start rounded-full border px-3 text-xs font-medium",
                        badge.className,
                      )}
                    >
                      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", badge.dot)} />
                      {badge.label}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-kozeo-light/60 p-4 text-sm md:grid-cols-4">
                    <div className="flex flex-col">
                      <dt className="text-xs text-kozeo-violet/50">Total TTC</dt>
                      <dd className="text-base font-bold text-kozeo-violet">{formatEUR(d.totalTTC)}</dd>
                    </div>
                    {d.remise ? (
                      <div className="flex flex-col">
                        <dt className="text-xs text-kozeo-violet/50">Remise</dt>
                        <dd className="font-medium text-kozeo-vert-dark">−{formatEUR(d.remise)}</dd>
                      </div>
                    ) : null}
                    {acompteEur !== null ? (
                      <div className="flex flex-col">
                        <dt className="text-xs text-kozeo-violet/50">Acompte {d.acomptePct}%</dt>
                        <dd className="font-medium text-kozeo-violet">{formatEUR(acompteEur)}</dd>
                      </div>
                    ) : null}
                    <div className="flex flex-col">
                      <dt className="text-xs text-kozeo-violet/50">Reste à payer</dt>
                      <dd className={cn("font-bold", d.soldeRestant > 0 ? "text-kozeo-orange" : "text-kozeo-vert-dark")}>
                        {formatEUR(d.soldeRestant)}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap items-center gap-2">
                    <PdfPreview
                      src={`/api/devis/${d.id}/pdf?token=${encodeURIComponent(token)}`}
                      filename={`devis-${d.ref}.pdf`}
                      label="Voir le devis"
                    />
                  </div>

                  {d.attachments.length > 0 ? (
                    <div className="flex flex-col gap-2 border-t border-kozeo-violet/[0.06] pt-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                        Pièces jointes ({d.attachments.length})
                      </span>
                      <ul className="flex flex-wrap gap-2">
                        {d.attachments.map((a) => (
                          <li key={a.id}>
                            <PdfPreview
                              src={`/api/devis/${d.id}/files/${a.id}?name=${encodeURIComponent(a.name)}&token=${encodeURIComponent(token)}`}
                              filename={a.name}
                              label={`${a.name.replace(/\.pdf$/i, "")} · ${fmtSize(a.size)}`}
                              variant="secondary"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
