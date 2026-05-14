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
  InterventionReportFile,
  InterventionStatus,
  InterventionType,
} from "./types";

const TIMEOUT_MS = 8000;
const ALLOWED_DEVIS_STATUS: ReadonlyArray<DevisStatus> = [
  "draft", "finalized", "sent", "signed", "canceled", "refused", "paid",
];
const ALLOWED_BILL_STATUS: ReadonlyArray<BillStatus> = [
  "draft", "finalized", "sent", "paid", "canceled",
];

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
      headers: { "X-Api-Key": process.env.IF_API_KEY!, Accept: "application/json" },
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
    headers: { "X-Api-Key": process.env.IF_API_KEY! },
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

    const [devisWithAttachments, interventions] = await Promise.all([
      Promise.all(quotations.items.map(async (q) => {
        try {
          const detail = await ifFetch<IfQuotationDetail>(`/billing/quotations/${q.id}`);
          return normalizeQuotation(q, detail.attachements ?? []);
        } catch {
          return normalizeQuotation(q, []);
        }
      })),
      Promise.all(events.items.map(async (e) => {
        try {
          const files = await ifFetch<IfReportFile[]>(`/interventions/${e.id}/report/files`);
          return normalizeEvent(e, files ?? []);
        } catch {
          return normalizeEvent(e, []);
        }
      })),
    ]);

    return {
      client: normalizeClient(client),
      interventions,
      devis: devisWithAttachments,
      bills: bills.items.map(normalizeBill),
    };
  } catch (err) {
    console.error("[interfast] fetchClientBundle failed:", err);
    return null;
  }
}

// ───────────── OWNERSHIP CHECKS (sécu : un token client A ne peut pas tirer une ressource du client B)

export async function devisBelongsToClient(devisId: string, clientId: string): Promise<boolean> {
  if (useMock()) {
    return Object.values(MOCK_CLIENTS).some(
      (b) => b.client.id === clientId && b.devis.some((d) => d.id === devisId),
    );
  }
  try {
    const d = await ifFetch<{ client: { id: number } }>(
      `/billing/quotations/${encodeURIComponent(devisId)}`,
    );
    return String(d.client?.id) === clientId;
  } catch {
    return false;
  }
}

export async function billBelongsToClient(billId: string, clientId: string): Promise<boolean> {
  if (useMock()) {
    return Object.values(MOCK_CLIENTS).some(
      (b) => b.client.id === clientId && b.bills.some((x) => x.id === billId),
    );
  }
  try {
    const d = await ifFetch<{ client: { id: number } }>(
      `/billing/bills/${encodeURIComponent(billId)}`,
    );
    return String(d.client?.id) === clientId;
  } catch {
    return false;
  }
}

export async function interventionBelongsToClient(
  interventionId: string,
  clientId: string,
): Promise<boolean> {
  if (useMock()) {
    return Object.values(MOCK_CLIENTS).some(
      (b) =>
        b.client.id === clientId &&
        b.interventions.some((i) => i.id === interventionId),
    );
  }
  try {
    const d = await ifFetch<{ id: number }>(`/intervention/${encodeURIComponent(interventionId)}`);
    // Pas de client.id direct sur intervention. Fallback : check via la liste events du client.
    const id = encodeURIComponent(clientId);
    const ev = await ifFetch<IfPaginated<IfEvent>>(`/client/${id}/events?page=0&count=200`);
    return ev.items.some((e) => String(e.id) === String(d.id) || String(e.id) === interventionId);
  } catch {
    return false;
  }
}

// ───────────── TYPES INTER-FAST

type IfPaginated<T> = { count: number; items: T[] };

type IfContact = {
  gender: "male" | "female" | string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type IfClient = {
  id: number;
  reference: number | string;
  name: string;
  displayName: string;
  type: "particular" | "professional" | "ownersAssociation";
  clientParticular: { contact: IfContact } | null;
  clientProfessional: {
    legalName?: string;
    contact?: IfContact;
    contacts?: IfContact[];
  } | null;
  clientOwnersAssociation: {
    name?: string;
    contact?: IfContact;
    contacts?: IfContact[];
  } | null;
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

type IfReportFile = {
  id: string;
  name: string;
  category: string;
  href: string;
  mimeType: string;
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

// ───────────── NORMALIZERS

function civilityFromGender(g: string | null | undefined): Civility {
  if (g === "female") return "Mme";
  return "M.";
}

function pickContact(c: IfClient): IfContact | null {
  return (
    c.clientParticular?.contact ??
    c.clientProfessional?.contact ??
    (c.clientProfessional?.contacts?.[0] as IfContact | undefined) ??
    c.clientOwnersAssociation?.contact ??
    (c.clientOwnersAssociation?.contacts?.[0] as IfContact | undefined) ??
    null
  );
}

function normalizeClient(c: IfClient): Client {
  const contact = pickContact(c);
  const refStr = typeof c.reference === "number" ? `C${c.reference}` : String(c.reference);
  const fallbackName = (c.displayName || c.name || "").split(" ");
  return {
    id: String(c.id),
    ref: refStr,
    civility: civilityFromGender(contact?.gender ?? null),
    firstName: contact?.firstName ?? fallbackName[1] ?? fallbackName[0] ?? "",
    lastName: contact?.lastName ?? fallbackName[0] ?? "",
    email: contact?.email ?? "",
    phone: contact?.phoneNumber ?? "",
    address: c.primaryAddress?.address ?? "—",
    city: c.primaryAddress?.city ?? "",
    zipCode: c.primaryAddress?.zipCode ?? "",
  };
}

function interventionTypeFromIf(t: string): InterventionType {
  const s = (t || "").toLowerCase();
  if (/visite|fiche chantier/.test(s)) return "visite_technique";
  if (/installation|pose|fin d'installation/.test(s)) return "installation";
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

function normalizeEvent(e: IfEvent, files: IfReportFile[]): Intervention {
  return {
    id: e.id,
    ref: e.reference,
    title: e.title,
    type: interventionTypeFromIf(e.type || e.title),
    start: e.start,
    end: e.end,
    status: interventionStatusFromIf(e),
    technicians: e.users.map((u) => u.firstName).filter(Boolean),
    address: e.address ?? null,
    reportFiles: files.map(normalizeReportFile),
  };
}

function normalizeReportFile(f: IfReportFile): InterventionReportFile {
  return { id: f.id, name: f.name, category: f.category, mimeType: f.mimeType };
}

function safeDevisStatus(s: string): DevisStatus | "unknown" {
  return (ALLOWED_DEVIS_STATUS as ReadonlyArray<string>).includes(s) ? (s as DevisStatus) : "unknown";
}

function safeBillStatus(s: string): BillStatus | "unknown" {
  return (ALLOWED_BILL_STATUS as ReadonlyArray<string>).includes(s) ? (s as BillStatus) : "unknown";
}

function normalizeQuotation(q: IfBilling, attachements: IfAttachment[]): Devis {
  const acomptePct = q.balance > 0 && q.amountVAT > 0
    ? Math.round(((q.amountVAT - q.balance) / q.amountVAT) * 100)
    : null;
  return {
    id: q.id,
    ref: q.reference,
    name: q.name,
    status: safeDevisStatus(q.status),
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
  return { id: a.id, name: a.name, size: a.size, mimeType: a.mimeType };
}

function normalizeBill(b: IfBilling): Bill {
  return {
    id: b.id,
    ref: b.reference,
    name: b.name,
    status: safeBillStatus(b.status),
    issueDate: b.issueDate ?? "",
    totalHT: b.amountExcludedTax,
    totalTTC: b.amountVAT,
    soldeRestant: b.balance,
  };
}
