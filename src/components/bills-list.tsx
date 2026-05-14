import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import type { Bill } from "@/lib/types";
import { cn, formatDateShort, formatEUR } from "@/lib/utils";

const STATUS_BADGE: Record<Bill["status"], { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-kozeo-violet/5 text-kozeo-violet/70 border-kozeo-violet/15" },
  finalized: { label: "À régler", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30" },
  sent: { label: "À régler", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30" },
  paid: { label: "Payée", className: "bg-kozeo-vert/15 text-kozeo-vert-dark border-kozeo-vert/40" },
  canceled: { label: "Annulée", className: "bg-kozeo-violet/5 text-kozeo-violet/40 border-kozeo-violet/15" },
};

export function BillsList({ bills }: { bills: Bill[] }) {
  if (bills.length === 0) {
    return null;
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
                <CardContent className="flex flex-col gap-3 pt-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                      Facture {b.ref}
                    </span>
                    <h3 className="text-base font-semibold text-kozeo-violet">{b.name}</h3>
                    <p className="text-sm text-kozeo-violet/60">
                      Émise le {formatDateShort(b.issueDate)} · {formatEUR(b.totalTTC)} TTC
                      {b.soldeRestant > 0 ? (
                        <> · <span className="text-kozeo-orange font-medium">Reste {formatEUR(b.soldeRestant)}</span></>
                      ) : null}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex h-7 items-center self-start rounded-full border px-3 text-xs font-medium md:self-center",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
