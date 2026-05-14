import type { Client } from "@/lib/types";

export function ClientHeader({ client }: { client: Client }) {
  const displayName = `${client.civility} ${client.firstName} ${client.lastName}`;
  return (
    <header className="flex flex-col gap-3 border-b border-black/[0.06] pb-6">
      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-vert-dark">
        Espace client Kozéo
      </span>
      <h1 className="text-3xl font-semibold text-kozeo-navy md:text-4xl">
        Bonjour {client.firstName} 👋
      </h1>
      <p className="text-base text-kozeo-navy/70">
        Retrouvez ici tout ce qui concerne votre projet avec Kozéo : interventions
        prévues, devis signés, factures à venir et contacts utiles.
      </p>
      <p className="text-sm text-kozeo-navy/50">
        Référence client : <span className="font-mono">{client.ref}</span>
        {client.city ? <> · {client.city}</> : null}
      </p>
      <p className="sr-only">Compte de {displayName}</p>
    </header>
  );
}
