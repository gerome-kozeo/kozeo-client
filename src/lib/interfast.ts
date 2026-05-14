import "server-only";
import { MOCK_CLIENTS } from "./interfast-mock";
import type {
  Attachment,
  Bill,
  BillStatus,
  Civility,
  Client,
  ClientBundle,
  Devis,
  DevisStatus,
  Intervention,
  InterventionStatus,
  InterventionType,
} from "./types";

const TIMEOUT_MS = 8000;

function useMock(): boolean {
  return !process.env.IF_API_KEY;
}

function getBase(): string {
  return process.env.IF_API_BASE || "https://app.inter-fast.fr/v1";
}

async function ifFetch<T>(path: string): Promise<T> {
  const url = `${getBase()}${path}`;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.IF_API_KEY!,
        Accept: "application/json",
      },
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`IF ${path} → ${res.status} ${body.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function ifFetchStream(path: string): Promise<Response> {
  const url = `${getBase()}${path}`;
  return fetch(url, {
    headers: {
      "X-Api-Key": process.env.IF_API_KEY!,
    },
    cache: "no-store",
  });
}

export async function fetchClientBundle(clientId: string): Promise<ClientBundle | null> {
  if (useMock()) {
    return MOCK_CLIENTS[clientId] ?? null;
  }
  try {
    const id = encodeURIComponent(clientId);
    const [client, events, quotations, bills] = await Promise.all([
      ifFetch<IfClient>(`/client/${id}`),
      ifFetch<IfPaginated<IfEvent>>(`/client/${id}/events?page=0&count=200`),
      ifFetch<IfPaginated<IfBilling>>(`/billing/quotations?page=0&size=100&clients[]=${id}`),
      ifFetch<IfPaginated<IfBilling>>(`/billing/bills?page=0&size=100&clients[]=${id}`),
    ]);

    const devisWithAttachments = await Promise.all(
      quotations.items.map(async (q) => {
        try {
          const detail = await ifFetch<IfQuotationDetail>(`/billing/quotations/${q.id}`);
          return normalizeQuotation(q, detail.attachements ?? []);
        } catch {
          return normalizeQuotation(q, []);
        }
      }),
    );

    return {
      client: normalizeClient(client),
      interventions: events.items.map(normalizeEvent),
      devis: devisWithAttachments,
      bills: bills.items.map(normalizeBill),
    };
  } catch (err) {
    console.error("[interfast] fetchClientBundle failed:", err);
    return null;
  }
}

type IfPaginated<T> = { count: number; items: T[] };

type IfClient = {
  id: number;
  reference: number | string;
  name: string;
  displayName: string;
  type: "particular" | "professional" | "ownersAssociation";
  clientParticular: {
    contact: {
      gender: "male" | "female" | string | null;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    };
  } | null;
  clientProfessional: { name?: string; legalName?: string } | null;
  primaryAddress: {
    address: string;
    additionalLine?: string;
    zipCode: string;
    city: string;
  } | null;
};

type IfEvent = {
  id: string;
  category: string;
  title: string;
  reference: string;
  type: string;
  start: string;
  end: string;
  finished: boolean;
  lifecycleState: string;
  client: { id: number; name: string };
  users: Array<{ firstName: string; lastName: string }>;
  address: string | null;
};

type IfBilling = {
  id: string;
  name: string;
  reference: string;
  status: string;
  type: "quotation" | "bill";
  issueDate: string | null;
  signedAt: string | null;
  endDate: string | null;
  amountExcludedTax: number;
  amountVAT: number;
  balance: number;
};

type IfAttachment = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  href: string;
  category: string;
};

type IfQuotationDetail = IfBilling & {
  fileName: string;
  attachements: IfAttachment[];
};

function civilityFromGender(g: string | null | undefined): Civility {
  if (g === "female") return "Mme";
  return "M.";
}

function normalizeClient(c: IfClient): Client {
  const contact = c.clientParticular?.contact;
  const refStr = typeof c.reference === "number" ? `C${c.reference}` : String(c.reference);
  return {
    id: String(c.id),
    ref: refStr,
    civility: civilityFromGender(contact?.gender ?? null),
    firstName: contact?.firstName ?? c.displayName.split(" ")[0] ?? "",
    lastName: contact?.lastName ?? "",
    email: contact?.email ?? "",
    phone: contact?.phoneNumber ?? "",
    address: c.primaryAddress?.address ?? "—",
    city: c.primaryAddress?.city ?? "",
    zipCode: c.primaryAddress?.zipCode ?? "",
  };
}

function interventionTypeFromIf(t: string): InterventionType {
  const s = t.toLowerCase();
  if (/visite/.test(s)) return "visite_technique";
  if (/installation|pose/.test(s)) return "installation";
  if (/entretien|maintenance|contrôle/.test(s)) return "entretien";
  if (/dépannage|depanage|dépanage/.test(s)) return "depannage";
  if (/sav|garantie/.test(s)) return "sav";
  return "autre";
}

function interventionStatusFromIf(ev: IfEvent): InterventionStatus {
  if (ev.lifecycleState === "canceled" || ev.lifecycleState === "cancelled") return "canceled";
  if (ev.finished) return "done";
  return "planned";
}

function normalizeEvent(e: IfEvent): Intervention {
  return {
    id: e.id,
    ref: e.reference,
    title: e.title,
    type: interventionTypeFromIf(e.type),
    start: e.start,
    end: e.end,
    status: interventionStatusFromIf(e),
    technicians: e.users.map((u) => u.firstName).filter(Boolean),
    address: e.address ?? null,
  };
}

function normalizeQuotation(q: IfBilling, attachements: IfAttachment[]): Devis {
  const acomptePct = q.balance > 0 && q.amountVAT > 0
    ? Math.round(((q.amountVAT - q.balance) / q.amountVAT) * 100)
    : null;
  return {
    id: q.id,
    ref: q.reference,
    name: q.name,
    status: q.status as DevisStatus,
    createdAt: q.issueDate ?? "",
    signedAt: q.signedAt,
    totalHT: q.amountExcludedTax,
    totalTTC: q.amountVAT,
    soldeRestant: q.balance,
    remise: null,
    acomptePct: acomptePct && acomptePct > 0 ? acomptePct : null,
    attachments: attachements.map(normalizeAttachment),
  };
}

function normalizeAttachment(a: IfAttachment): Attachment {
  return {
    id: a.id,
    name: a.name,
    size: a.size,
    mimeType: a.mimeType,
  };
}

function normalizeBill(b: IfBilling): Bill {
  return {
    id: b.id,
    ref: b.reference,
    name: b.name,
    status: b.status as BillStatus,
    issueDate: b.issueDate ?? "",
    totalHT: b.amountExcludedTax,
    totalTTC: b.amountVAT,
    soldeRestant: b.balance,
  };
}
