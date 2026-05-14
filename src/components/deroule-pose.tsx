import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { deroulePoseFor, type Categorie } from "@/lib/prestation";

const CATEGORIE_TITLE: Record<Categorie, string> = {
  pac: "Comment se déroule l'installation de votre pompe à chaleur",
  clim: "Comment se déroule l'installation de votre climatisation",
  pv: "Comment se déroulent vos panneaux solaires",
  adoucisseur: "Comment se déroule l'installation de votre adoucisseur",
  cet: "Comment se déroule l'installation de votre chauffe-eau thermodynamique",
  ve: "Comment se déroule l'installation de votre borne de recharge",
  autre: "Comment se déroule votre intervention",
};

export function DeroulePose({ categorie }: { categorie: Categorie }) {
  const steps = deroulePoseFor(categorie);
  return (
    <Section title={CATEGORIE_TITLE[categorie]} eyebrow="Ce qui va se passer">
      <Card>
        <CardContent className="pt-6">
          <ol className="flex flex-col gap-6 md:flex-row md:gap-4">
            {steps.map((s, i) => (
              <li key={s.title} className="relative flex flex-1 gap-4 md:flex-col md:gap-3">
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-kozeo-vert-accent/10 text-base font-bold text-kozeo-vert-dark">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 ? (
                    <span aria-hidden className="hidden h-px flex-1 bg-kozeo-vert-accent/20 md:block" />
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-kozeo-violet">{s.title}</h3>
                  <p className="text-sm text-kozeo-violet/70">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </Section>
  );
}
