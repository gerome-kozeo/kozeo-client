import { Card, CardContent } from "@/components/ui/card";
import { PdfPreview } from "@/components/pdf-preview";
import { Section } from "@/components/ui/section";
import type { Bill } from "@/lib/types";
import { cn, formatDateShort, formatEUR } from "@/lib/utils";

const STATUS_BADGE: Record<Bill["status"], { label: string; className: string; dot: string }> = {
  draft: { label: "Brouillon", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15", dot: "bg-kozeo-violet/40" },
  finalized: { label: "À régler", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30", dot: "bg-kozeo-orange" },
  sent: { label: "À régler", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30", dot: "bg-kozeo-orange" },
  paid: { label: "Payée", className: "bg-kozeo-vert/15 text-kozeo-vert-dark border-kozeo-vert/40", dot: "bg-kozeo-vert" },
  canceled: { label: "Annulée", className: "bg-kozeo-violet/5 text-kozeo-violet/40 border-kozeo-violet/15", dot: "bg-kozeo-violet/30" },
  unknown: { label: "—", className: "bg-kozeo-violet/5 text-kozeo-violet/50 border-kozeo-violet/15", dot: "bg-kozeo-violet/30" },
};

export function BillsList({ bills, token }: { bills: Bill[]; token: string }) {
  if (bills.length === 0) {
    return (
      <Section title="Vos factures" eyebrow="Comptabilité">
        <Card>
          <CardContent>
            <p className="text-sm text-kozeo-violet/60">Aucune facture pour le moment.</p>
          </CardContent>
        </Card>
      </Section>
    );
  }

  const sorted = [...bills].sort((a, b) => (a.issueDate < b.issueDate ? 1 : -1));

  return (
    <Section title="Vos factures" eyebrow="Comptabilité">
      <ul className="flex flex-col gap-3">
        {sorted.map((b) => {
          const badge = STATUS_BADGE[b.status];
          return (
            <li key={b.id}>
              <Card>
                <CardContent className="flex flex-col gap-4 pt-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                        Facture {b.ref}
                      </span>
                      <h3 className="text-base font-semibold text-kozeo-violet">{b.name}</h3>
                      <p className="text-sm text-kozeo-violet/60">
                        Émise le {formatDateShort(b.issueDate)} · {formatEUR(b.totalTTC)} TTC
                        {b.soldeRestant > 0 ? (
                          <> · <span className="font-medium text-kozeo-orange">Reste {formatEUR(b.soldeRestant)}</span></>
                        ) : null}
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
                  <div className="flex flex-wrap gap-2">
                    <PdfPreview
                      src={`/api/bills/${b.id}/pdf?token=${encodeURIComponent(token)}`}
                      filename={`facture-${b.ref}.pdf`}
                      label="Voir la facture"
                    />
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
