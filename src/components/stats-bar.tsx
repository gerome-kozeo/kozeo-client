import type { Bill, Devis, Intervention } from "@/lib/types";
import { formatEUR } from "@/lib/utils";

type Props = {
  interventions: Intervention[];
  devis: Devis[];
  bills: Bill[];
};

export function StatsBar({ interventions, devis, bills }: Props) {
  const upcoming = interventions.filter((i) => i.status === "planned").length;
  const totalTTC = devis.reduce((sum, d) => sum + d.totalTTC, 0);
  const soldeRestant = bills.reduce((sum, b) => sum + b.soldeRestant, 0);

  const stats: Array<{ label: string; value: string; hint?: string }> = [
    {
      label: "Interventions",
      value: String(interventions.length),
      hint: upcoming > 0 ? `dont ${upcoming} à venir` : undefined,
    },
    {
      label: "Total projet",
      value: formatEUR(totalTTC),
      hint: devis.length > 0 ? `${devis.length} devis` : undefined,
    },
    {
      label: "Reste à payer",
      value: soldeRestant > 0 ? formatEUR(soldeRestant) : "Soldé ✓",
      hint: bills.length > 0 ? `${bills.length} facture${bills.length > 1 ? "s" : ""}` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 rounded-2xl border border-kozeo-violet/8 bg-white px-4 py-4 shadow-card sm:px-5 sm:py-5"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-kozeo-violet/50 sm:text-xs">
            {s.label}
          </span>
          <span className="text-lg font-bold leading-tight text-kozeo-violet sm:text-2xl">
            {s.value}
          </span>
          {s.hint ? (
            <span className="text-[11px] text-kozeo-violet/50 sm:text-xs">{s.hint}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
