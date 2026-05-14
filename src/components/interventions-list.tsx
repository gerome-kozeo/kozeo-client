import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { INTERVENTION_LABEL, sortInterventionsChrono } from "@/lib/prestation";
import type { Intervention } from "@/lib/types";
import { cn, formatDateLong, formatTimeRange } from "@/lib/utils";

const STATUS_BADGE: Record<Intervention["status"], { label: string; className: string }> = {
  planned: { label: "À venir", className: "bg-kozeo-vert/10 text-kozeo-vert-dark border-kozeo-vert/30" },
  done: { label: "Réalisée", className: "bg-kozeo-violet/5 text-kozeo-violet border-kozeo-violet/15" },
  canceled: { label: "Annulée", className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30" },
};

const REPORT_CATEGORY_LABEL: Record<string, string> = {
  report: "Rapport d'intervention",
  cerfa: "Attestation Cerfa (TVA réduite)",
  custom: "Document",
  attachment: "Pièce jointe",
};

function reportLabel(category: string): string {
  return REPORT_CATEGORY_LABEL[category] ?? "Document";
}

export function InterventionsList({
  interventions,
  token,
}: {
  interventions: Intervention[];
  token: string;
}) {
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
                <CardContent className="flex flex-col gap-3 pt-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
                  </div>

                  {iv.reportFiles.length > 0 ? (
                    <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-3">
                      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                        Documents liés ({iv.reportFiles.length})
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {iv.reportFiles.map((f) => (
                          <li key={f.id} className="flex items-center justify-between gap-2">
                            <a
                              href={`/api/interventions/${iv.id}/files/${f.id}?name=${encodeURIComponent(f.name)}&token=${encodeURIComponent(token)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-kozeo-vert-dark underline underline-offset-4 hover:text-kozeo-vert"
                            >
                              <span aria-hidden>📄</span>
                              <span className="truncate">{f.name}</span>
                            </a>
                            <span className="shrink-0 text-xs text-kozeo-violet/40">
                              {reportLabel(f.category)}
                            </span>
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
      </ol>
    </Section>
  );
}
