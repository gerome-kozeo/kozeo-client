import "server-only";
import { MOCK_CLIENTS } from "./interfast-mock";
import type { ClientBundle } from "./types";

const TIMEOUT_MS = 8000;

function useMock(): boolean {
  return !process.env.IF_API_KEY;
}

async function ifFetch<T>(path: string): Promise<T> {
  const base = process.env.IF_API_BASE || "https://api.interfast.io/v1";
  const url = `${base}${path}`;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.IF_API_KEY}`,
        Accept: "application/json",
      },
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`IF ${path} → ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchClientBundle(clientId: string): Promise<ClientBundle | null> {
  if (useMock()) {
    return MOCK_CLIENTS[clientId] ?? null;
  }

  // TODO endpoints à valider avec la doc IF + repo kozeo-clients existant (lib/interfast.ts production)
  // Hypothèses de pattern REST :
  //   GET /v1/clients/{id}                  → fiche client
  //   GET /v1/billing/quotations?client={id}&page=0&count=50 → devis du client
  //   GET /v1/events?client={id}&page=0&count=100           → interventions du client
  // À adapter quand on aura la shape exacte sous les yeux.
  try {
    const [client, devis, events] = await Promise.all([
      ifFetch<any>(`/clients/${encodeURIComponent(clientId)}`),
      ifFetch<any>(`/billing/quotations?client=${encodeURIComponent(clientId)}&count=50`),
      ifFetch<any>(`/events?client=${encodeURIComponent(clientId)}&count=100`),
    ]);
    return normalizeBundle(client, devis, events);
  } catch (err) {
    console.error("[interfast] fetchClientBundle failed:", err);
    return null;
  }
}

function normalizeBundle(_client: unknown, _devis: unknown, _events: unknown): ClientBundle {
  // TODO mapping exact à écrire après inspection de la shape réelle IF en réponse.
  // Pour l'instant, lever une erreur explicite plutôt que retourner du n'importe quoi.
  throw new Error("[interfast] normalizeBundle non implémenté — brancher quand IF_API_KEY actif.");
}
