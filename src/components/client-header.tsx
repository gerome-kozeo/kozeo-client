import type { Client } from "@/lib/types";

export function ClientHeader({ client }: { client: Client }) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-kozeo-violet via-kozeo-violet to-[#2a1f47] px-6 py-10 text-white shadow-card sm:px-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-kozeo-vert-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-kozeo-vert/15 blur-3xl"
      />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-medium uppercase tracking-wider text-kozeo-vert-accent backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-kozeo-vert-accent" />
            Espace client
          </span>
          <span className="text-xs font-medium text-white/40">
            <span className="font-mono">{client.ref}</span>
          </span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Bonjour {client.firstName} <span aria-hidden>👋</span>
        </h1>
        <p className="max-w-xl text-base text-white/70 sm:text-lg">
          Tout votre projet Kozéo en un coup d'œil : interventions, devis, factures, documents.
          Pas de coup de fil à passer pour suivre votre dossier.
        </p>
        {client.city ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/50">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {client.city}
          </p>
        ) : null}
      </div>
    </header>
  );
}
