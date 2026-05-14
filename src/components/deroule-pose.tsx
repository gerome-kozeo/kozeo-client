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
        <CardContent className="pt-5">
          <ol className="flex flex-col gap-5">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kozeo-vert/15 text-sm font-semibold text-kozeo-vert-dark">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-kozeo-navy">{s.title}</h3>
                  <p className="text-sm text-kozeo-navy/70">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </Section>
  );
}
