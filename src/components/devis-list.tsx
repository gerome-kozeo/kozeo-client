import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Devis } from "@/lib/types";
import { cn, formatDateShort, formatEUR } from "@/lib/utils";

const STATUS_BADGE: Record<Devis["status"], { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15" },
  finalized: { label: "Finalisé", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15" },
  sent: { label: "Envoyé", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30" },
  signed: { label: "Signé", className: "bg-kozeo-vert/10 text-kozeo-vert-dark border-kozeo-vert/30" },
  canceled: { label: "Annulé", className: "bg-kozeo-violet/5 text-kozeo-violet/40 border-kozeo-violet/15" },
  refused: { label: "Refusé", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30" },
  paid: { label: "Payé", className: "bg-kozeo-vert/15 text-kozeo-vert-dark border-kozeo-vert/40" },
};

export function DevisList({ devis }: { devis: Devis[] }) {
  if (devis.length === 0) {
    return (
      <Section title="Vos devis et factures" eyebrow="Documents">
        <Card>
          <CardContent>
            <p className="text-sm text-kozeo-violet/60">Aucun devis pour le moment.</p>
          </CardContent>
        </Card>
      </Section>
    );
  }

  return (
    <Section title="Vos devis et factures" eyebrow="Documents">
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
                        "inline-flex h-7 items-center self-start rounded-full border px-3 text-xs font-medium",
                        badge.className,
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-black/[0.05] pt-4 text-sm md:grid-cols-4">
                    <div className="flex flex-col">
                      <dt className="text-xs text-kozeo-violet/50">Total TTC</dt>
                      <dd className="font-semibold text-kozeo-violet">{formatEUR(d.totalTTC)}</dd>
                    </div>
                    {d.remise ? (
                      <div className="flex flex-col">
                        <dt className="text-xs text-kozeo-violet/50">Remise</dt>
                        <dd className="font-medium text-kozeo-vert-dark">−{formatEUR(d.remise)}</dd>
                      </div>
                    ) : null}
                    {acompteEur !== null ? (
                      <div className="flex flex-col">
                        <dt className="text-xs text-kozeo-violet/50">Acompte ({d.acomptePct}%)</dt>
                        <dd className="font-medium text-kozeo-violet">{formatEUR(acompteEur)}</dd>
                      </div>
                    ) : null}
                    <div className="flex flex-col">
                      <dt className="text-xs text-kozeo-violet/50">Reste à payer</dt>
                      <dd className="font-semibold text-kozeo-orange">{formatEUR(d.soldeRestant)}</dd>
                    </div>
                  </dl>

                  {d.pdfUrl ? (
                    <a
                      href={d.pdfUrl}
                      className="text-sm font-medium text-kozeo-vert-dark underline underline-offset-4 hover:text-kozeo-vert"
                    >
                      Télécharger le devis (PDF)
                    </a>
                  ) : (
                    <p className="text-xs text-kozeo-violet/40">
                      PDF disponible sur demande — contactez-nous pour recevoir une copie.
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
