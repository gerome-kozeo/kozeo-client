import type { ClientBundle } from "./types";

// Mock data alignée sur la shape REELLE de l'API Inter-Fast.
// Clé du dict = ID numérique Inter-Fast (champ `id`, pas le `reference` C0xxx).
// Sert de fallback quand IF_API_KEY n'est pas configuré.
export const MOCK_CLIENTS: Record<string, ClientBundle> = {
  "1491724": {
    client: {
      id: "1491724",
      ref: "C861",
      civility: "M.",
      firstName: "Marcel",
      lastName: "Bert",
      email: "bert.marcelmb@gmail.com",
      phone: "+33699904048",
      address: "10 Rue des Mottes",
      city: "Fragnes-La Loyère",
      zipCode: "71530",
    },
    devis: [
      {
        id: "6c955199-8ad8-4d1c-83b6-157c174c8cce",
        ref: "DE-11-2025-760",
        name: "Installation d'un bi-split Daikin 4000W",
        status: "paid",
        createdAt: "2025-11-04",
        signedAt: "2025-12-01",
        totalHT: 4843.45,
        totalTTC: 5615.45,
        soldeRestant: 0,
        remise: null,
        acomptePct: 50,
        attachments: [
          {
            id: "056d8a0b-58c9-4eaa-b91e-5998188f46ab",
            name: "Brochure commercial Stylish.pdf",
            size: 644583,
            mimeType: "application/pdf",
          },
          {
            id: "13397d75-9e38-4fac-b79c-2cd127e5da7e",
            name: "Brochure climatisation-perfera-daikin.pdf",
            size: 483387,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    bills: [
      {
        id: "d76196f2-d869-4aa1-87ac-1c8042df6d5c",
        ref: "FA-11-2025-325",
        name: "Facture d'acompte du devis DE-11-2025-760",
        status: "paid",
        issueDate: "2025-12-07",
        totalHT: 2422.46,
        totalTTC: 2807.73,
        soldeRestant: 0,
      },
      {
        id: "fa-finale-marcel",
        ref: "FA-11-2026-348",
        name: "Facture finale du devis DE-11-2025-760",
        status: "paid",
        issueDate: "2026-01-14",
        totalHT: 2422.46,
        totalTTC: 2807.73,
        soldeRestant: 0,
      },
    ],
    interventions: [
      {
        id: "503180",
        ref: "IN00178",
        title: "Visite technique climatisation",
        type: "visite_technique",
        start: "2025-11-04T09:00:00+01:00",
        end: "2025-11-04T10:00:00+01:00",
        status: "done",
        technicians: ["Gérôme"],
        address: "Fragnes-La Loyère",
        reportFiles: [
          {
            id: "a3102fbb-d479-43f9-ac30-e34eb00fd6c4",
            name: "IN00178-Marcel Bert-Visite technique climatisation.pdf",
            category: "report",
            mimeType: "application/pdf",
          },
        ],
      },
      {
        id: "548853",
        ref: "IN00206",
        title: "Installation 2MXM40 (jour 1)",
        type: "installation",
        start: "2026-01-15T08:00:00+01:00",
        end: "2026-01-15T17:00:00+01:00",
        status: "done",
        technicians: ["Sami", "Tomas"],
        address: "Fragnes-La Loyère",
        reportFiles: [
          {
            id: "99c1d5dc-6949-4f04-9d43-a67dc8d5cfdc",
            name: "DE-11-2025-760-Liste articles.pdf",
            category: "custom",
            mimeType: "application/pdf",
          },
          {
            id: "98181753-b000-4907-ad97-9ef821f02944",
            name: "IN00206-Marcel Bert-Installation 2MXM40.pdf",
            category: "report",
            mimeType: "application/pdf",
          },
        ],
      },
      {
        id: "548854",
        ref: "IN00207",
        title: "Installation 2MXM40 (jour 2)",
        type: "installation",
        start: "2026-01-16T08:00:00+01:00",
        end: "2026-01-16T11:00:00+01:00",
        status: "done",
        technicians: ["Sami", "Tomas"],
        address: "Fragnes-La Loyère",
        reportFiles: [
          {
            id: "14b99cd2-a1a2-42f6-867b-20fd726c60ba",
            name: "DE-11-2025-760-Liste articles.pdf",
            category: "custom",
            mimeType: "application/pdf",
          },
          {
            id: "182fd6df-1669-40a6-aa3f-d86b3aa42aa2",
            name: "IN00207-Marcel Bert-Cerfa-47.pdf",
            category: "cerfa",
            mimeType: "application/pdf",
          },
        ],
      },
    ],
  },
};
