import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function ContactBloc() {
  return (
    <Section title="Une question ?" eyebrow="On reste joignable">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-5">
          <p className="text-sm text-kozeo-navy/70">
            Notre équipe répond du lundi au vendredi, 8h-12h et 14h-18h.
            En dehors de ces horaires, laissez-nous un message — on rappelle dès le lendemain.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a
              href="tel:0385947502"
              className="inline-flex h-11 items-center justify-center rounded-full bg-kozeo-vert px-5 text-base font-medium text-white hover:bg-kozeo-vert-dark"
            >
              📞 03 85 94 75 02
            </a>
            <a
              href="mailto:contact@kozeo.fr"
              className="inline-flex h-11 items-center justify-center rounded-full border border-kozeo-navy/15 bg-white px-5 text-base font-medium text-kozeo-navy hover:bg-kozeo-beige"
            >
              ✉ contact@kozeo.fr
            </a>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
