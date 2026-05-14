import type { Intervention, InterventionType, Devis } from "./types";

export type Categorie = "pac" | "clim" | "pv" | "adoucisseur" | "cet" | "ve" | "autre";

export function categorieFromDevis(devis: Devis | undefined): Categorie {
  if (!devis) return "autre";
  const n = devis.name.toLowerCase();
  if (/pompe à chaleur|pac\b|air-eau|air[- ]air/.test(n)) return "pac";
  if (/climatisation|clim\b|split/.test(n)) return "clim";
  if (/photovolta|panneau solaire|pv\b/.test(n)) return "pv";
  if (/adoucisseur|solucalc/.test(n)) return "adoucisseur";
  if (/chauffe[- ]eau thermo|cet\b/.test(n)) return "cet";
  if (/borne|ve\b/.test(n)) return "ve";
  return "autre";
}

export type StepInfo = {
  title: string;
  description: string;
};

export function deroulePoseFor(cat: Categorie): StepInfo[] {
  const generic: StepInfo[] = [
    {
      title: "Avant la pose",
      description: "Nous vous appelons 48h avant pour confirmer les horaires et préciser l'accès au logement.",
    },
    {
      title: "Le jour J",
      description:
        "L'équipe arrive avec le matériel, installe le système, contrôle l'étanchéité puis met en service. Nous restons sur place jusqu'à ce que tout fonctionne devant vous.",
    },
    {
      title: "Après la pose",
      description:
        "Démonstration du fonctionnement, remise des notices, facture envoyée par mail. Vous gardez notre numéro pour la moindre question.",
    },
  ];
  if (cat === "pac" || cat === "clim") {
    return [
      generic[0],
      {
        title: "Pose du système",
        description:
          "Mise en place du circuit frigorifique, contrôle d'étanchéité, mise au vide, mise en route. Vérification du bon fonctionnement avant de partir.",
      },
      {
        title: "Garanties Kozéo",
        description:
          "Compresseur : 5 ans · Pièces : 3 ans · Main d'œuvre et déplacement : 2 ans. Entretien annuel recommandé pour préserver la garantie constructeur.",
      },
    ];
  }
  return generic;
}

export const INTERVENTION_LABEL: Record<InterventionType, string> = {
  visite_technique: "Visite technique",
  installation: "Installation",
  entretien: "Entretien",
  depannage: "Dépannage",
  sav: "SAV",
  autre: "Intervention",
};

export function sortInterventionsChrono(list: Intervention[]): Intervention[] {
  return [...list].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}
