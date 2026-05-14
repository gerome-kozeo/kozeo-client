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
                <CardContent className="flex flex-col gap-3 pt-5">
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
                        "inline-flex h-7 items-center self-start rounded-full border px-3 text-xs font-medium",
                        badge.className,
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-black/[0.05] pt-4">
                    <a
                      href={`/api/bills/${b.id}/pdf?token=${encodeURIComponent(token)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-kozeo-vert-accent px-4 text-sm font-medium text-white hover:bg-kozeo-vert-dark"
                    >
                      📄 Voir la facture PDF
                    </a>
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
