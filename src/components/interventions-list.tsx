import { Card, CardContent } from "@/components/ui/card";
import { PdfPreview } from "@/components/pdf-preview";
import { Section } from "@/components/ui/section";
import { INTERVENTION_LABEL, sortInterventionsChrono } from "@/lib/prestation";
import type { Intervention } from "@/lib/types";
import { cn, formatDateLong, formatTimeRange } from "@/lib/utils";

const STATUS_BADGE: Record<Intervention["status"], { label: string; className: string; dot: string }> = {
  planned: {
    label: "À venir",
    className: "bg-kozeo-vert-accent/10 text-kozeo-vert-dark border-kozeo-vert-accent/30",
    dot: "bg-kozeo-vert-accent",
  },
  done: {
    label: "Réalisée",
    className: "bg-kozeo-violet/5 text-kozeo-violet/80 border-kozeo-violet/15",
    dot: "bg-kozeo-violet/40",
  },
  canceled: {
    label: "Annulée",
    className: "bg-kozeo-orange/10 text-kozeo-orange border-kozeo-orange/30",
    dot: "bg-kozeo-orange",
  },
};

const REPORT_CATEGORY_LABEL: Record<string, string> = {
  report: "Rapport",
  cerfa: "Cerfa (TVA réduite)",
  custom: "Document",
  attachment: "Pièce jointe",
};

function reportLabel(category: string): string {
  return REPORT_CATEGORY_LABEL[category] ?? "Document";
}

const TYPE_ICON: Record<string, JSX.Element> = {
  visite_technique: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  installation: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M10 14H4v6M21 3l-7 7M3 21l7-7" />
    </svg>
  ),
  entretien: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  depannage: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-3 7h4l-3 7v6" />
      <path d="M12 22a10 10 0 0 0 0-20" />
    </svg>
  ),
  sav: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  autre: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

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
            <p className="text-sm text-kozeo-violet/60">Aucune intervention enregistrée pour le moment.</p>
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
          const icon = TYPE_ICON[iv.type] ?? TYPE_ICON.autre;
          return (
            <li key={iv.id}>
              <Card>
                <CardContent className="flex flex-col gap-4 pt-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                          iv.status === "planned"
                            ? "bg-kozeo-vert-accent/10 text-kozeo-vert-dark"
                            : "bg-kozeo-light text-kozeo-violet/70",
                        )}
                      >
                        {icon}
                      </span>
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
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 self-start rounded-full border px-3 text-xs font-medium md:self-center",
                        badge.className,
                      )}
                    >
                      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", badge.dot)} />
                      {badge.label}
                    </span>
                  </div>

                  {iv.reportFiles.length > 0 ? (
                    <div className="flex flex-col gap-2 border-t border-kozeo-violet/[0.06] pt-4">
                      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-violet/50">
                        Documents ({iv.reportFiles.length})
                      </span>
                      <ul className="flex flex-wrap gap-2">
                        {iv.reportFiles.map((f) => (
                          <li key={f.id} className="flex flex-col items-start gap-1">
                            <PdfPreview
                              src={`/api/interventions/${iv.id}/files/${f.id}?name=${encodeURIComponent(f.name)}&token=${encodeURIComponent(token)}`}
                              filename={f.name}
                              label={reportLabel(f.category)}
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
      </ol>
    </Section>
  );
}
