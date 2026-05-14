export type Civility = "M." | "Mme" | "Mlle" | "M. & Mme";

export type Client = {
  id: string;
  ref: string;
  civility: Civility;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
};

export type DevisStatus = "draft" | "finalized" | "sent" | "signed" | "canceled" | "refused" | "paid";
export type BillStatus = "draft" | "finalized" | "sent" | "paid" | "canceled";

export type Attachment = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
};

export type Devis = {
  id: string;
  ref: string;
  name: string;
  status: DevisStatus | "unknown";
  createdAt: string;
  signedAt: string | null;
  totalHT: number;
  totalTTC: number;
  soldeRestant: number;
  remise: number | null;
  acomptePct: number | null;
  attachments: Attachment[];
};

export type Bill = {
  id: string;
  ref: string;
  name: string;
  status: BillStatus | "unknown";
  issueDate: string;
  totalHT: number;
  totalTTC: number;
  soldeRestant: number;
};

export type InterventionStatus = "planned" | "done" | "canceled";

export type InterventionType =
  | "visite_technique"
  | "installation"
  | "entretien"
  | "depannage"
  | "sav"
  | "autre";

export type InterventionReportFile = {
  id: string;
  name: string;
  category: string;
  mimeType: string;
};

export type Intervention = {
  id: string;
  ref: string;
  title: string;
  type: InterventionType;
  start: string;
  end: string;
  status: InterventionStatus;
  technicians: string[];
  address: string | null;
  reportFiles: InterventionReportFile[];
};

export type ClientBundle = {
  client: Client;
  devis: Devis[];
  bills: Bill[];
  interventions: Intervention[];
};
