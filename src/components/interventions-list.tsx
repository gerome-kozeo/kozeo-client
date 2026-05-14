import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { INTERVENTION_LABEL, sortInterventionsChrono } from "@/lib/prestation";
import type { Intervention } from "@/lib/types";
import { cn, formatDateLong, formatTimeRange } from "@/lib/utils";

const STATUS_BADGE: Record<Intervention["status"], { label: string; className: string }> = {
  planned: {
    label: "À venir",
    className: "bg-kozeo-vert/10 text-kozeo-vert-dark border-kozeo-vert/30",
  },
  done: {
    label: "Réalisée",
    className: "bg-kozeo-violet/5 text-kozeo-violet border-kozeo-violet/15",
  },
  canceled: {
    label: "Annulée",
    className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30",
  },
};

export function InterventionsList({ interventions }: { interventions: Intervention[] }) {
  if (interventions.length === 0) {
    return (
      <Section title="Vos interventions" eyebrow="Planning">
        <Card>
          <CardContent>
            <p className="text-sm text-kozeo-violet/60">
              Aucune intervention enregistrée pour le moment.
            </p>
          </CardContent>
        </Card>
      </Section>
    );
  }

  const sorted = sortInterventionsChrono(interventions);
  return (
    <Section title="Vos interventions" eyebrow="Planning">
      <ol className="flex flex-col gap-3">
        {sorted.map((iv) => {
          const badge = STATUS_BADGE[iv.status];
          return (
            <li key={iv.id}>
              <Card>
                <CardContent className="flex flex-col gap-3 pt-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                      {INTERVENTION_LABEL[iv.type]} · {iv.ref}
                    </span>
                    <h3 className="text-base font-semibold text-kozeo-violet">{iv.title}</h3>
                    <p className="text-sm text-kozeo-violet/70">
                      {formatDateLong(iv.start)} · {formatTimeRange(iv.start, iv.end)}
                    </p>
                    {iv.technicians.length > 0 && (
                      <p className="text-sm text-kozeo-violet/60">
                        Avec {iv.technicians.join(" & ")}
                      </p>
                    )}
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
      </ol>
    </Section>
  );
}
