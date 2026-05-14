import { notFound, redirect } from "next/navigation";
import { ClientHeader } from "@/components/client-header";
import { ClientTabs } from "@/components/client-tabs";
import { DeroulePose } from "@/components/deroule-pose";
import { FooterKozeo } from "@/components/footer-kozeo";
import { StatsBar } from "@/components/stats-bar";
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
    bundle.devis.find((d) => d.status === "signed" || d.status === "paid") ?? bundle.devis[0];
  const categorie = categorieFromDevis(lastSignedDevis);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 md:gap-8">
      <ClientHeader client={bundle.client} />
      <StatsBar
        interventions={bundle.interventions}
        devis={bundle.devis}
        bills={bundle.bills}
      />
      <ClientTabs
        interventions={bundle.interventions}
        devis={bundle.devis}
        bills={bundle.bills}
        token={params.token}
      />
      <DeroulePose categorie={categorie} />
      <FooterKozeo />
    </main>
  );
}
