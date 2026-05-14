import { notFound, redirect } from "next/navigation";
import { BillsList } from "@/components/bills-list";
import { ClientHeader } from "@/components/client-header";
import { ContactBloc } from "@/components/contact-bloc";
import { DeroulePose } from "@/components/deroule-pose";
import { DevisList } from "@/components/devis-list";
import { InterventionsList } from "@/components/interventions-list";
import { fetchClientBundle } from "@/lib/interfast";
import { categorieFromDevis } from "@/lib/prestation";
import { verifyClientToken } from "@/lib/token";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { token: string };

export default async function ClientPage({ params }: { params: Params }) {
  const verified = verifyClientToken(params.token);
  if (!verified.ok) {
    redirect("/");
  }

  const bundle = await fetchClientBundle(verified.payload.clientId);
  if (!bundle) {
    notFound();
  }

  const lastSignedDevis =
    bundle.devis.find((d) => d.status === "signed") ?? bundle.devis[0];
  const categorie = categorieFromDevis(lastSignedDevis);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 md:py-14">
      <ClientHeader client={bundle.client} />
      <InterventionsList interventions={bundle.interventions} />
      <DevisList devis={bundle.devis} />
      <BillsList bills={bundle.bills} />
      <DeroulePose categorie={categorie} />
      <ContactBloc />
      <footer className="border-t border-black/[0.06] pt-6 text-xs text-kozeo-violet/40">
        Kozéo · 4 rue de la Vigne, 71100 Saint-Rémy · SIRET 932 002 124 00018
      </footer>
    </main>
  );
}
