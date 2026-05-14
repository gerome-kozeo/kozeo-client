# Kozéo — Espace client (`client.kozeo.fr`)

Mini-portail clients Kozéo post-signature : un client logé via un **lien magique signé** (HMAC SHA-256) voit son dossier — interventions à venir / passées, devis signés, reste à payer, déroulé générique de pose, contact.

> Base de démarrage du 14 mai 2026 — itérative. Brief d'origine dans le vault Obsidian : `Projects/idee-espace-client-signataires.md`. Socle technique inspiré du projet `rdv.kozeo.fr` (repo `gerome-kozeo/kozeo-clients`).

## Stack

- **Next.js 14** (App Router, TypeScript, `src/` dir)
- **Tailwind CSS v3** + composants ShadCN-style maison (`Card`, `Button`, `Section`)
- **Inter Tight** (`next/font/google`)
- Mode **mock par défaut** : pas besoin de configurer Inter-Fast pour itérer l'UI

## Lancer en local

```bash
npm install
cp .env.local.example .env.local
# Édite .env.local et mets une valeur dans TOKEN_SECRET (>=16 chars). Ex :
#   openssl rand -base64 32 | tr -d '\n' > /tmp/secret && cat /tmp/secret
#   ou : TOKEN_SECRET=changeme-changeme-changeme-1234

# Génère un lien d'accès pour un client mock (C1044 = M. Voisin, C1053 = Mme Hallvaxhiu)
TOKEN_SECRET=changeme-changeme-changeme-1234 \
  node scripts/gen-client-token.mjs C1044

# → affiche http://localhost:3000/c/<token>

npm run dev
# ouvre l'URL imprimée ci-dessus
```

## Décisions prises pour cette base (à challenger)

| Sujet | Choix actuel | Pourquoi | À reconsidérer si |
|---|---|---|---|
| Auth | **Lien magique HMAC** dans l'URL | Pattern déjà rodé sur `rdv.kozeo.fr`. 0 stockage serveur. 0 mot de passe à oublier côté client. | Tu veux email+CP (cf section "Auth email+CP" plus bas) |
| Maille | **Client** (toutes ses interventions + devis), pas chantier | Cohérent avec ton mental model : 1 client = N interventions dans le temps | – |
| Validité token | **1 an** depuis émission | Couvre durée chantier + 1ère année Contrat Sérénité. Au-delà = re-générer | – |
| Data | **Mock par défaut**, Inter-Fast API si `IF_API_KEY` set | Permet de coder l'UI sans dépendre des endpoints IF réels | Quand on a la doc IF officielle ou le code de `lib/interfast.ts` du repo `kozeo-clients` sous les yeux |
| Domaine | URL relative — `client.kozeo.fr` à câbler côté Vercel/OVH | 0 manip DNS pour cette base | – |

## Ce qui marche dans cette base

- ✅ Token HMAC SHA-256 sign/verify avec comparaison temps constant (`lib/token.ts`)
- ✅ Vérif token côté Server Component, redirect `/` si invalide
- ✅ Page client avec : Header (bonjour) → Interventions (passées + à venir) → Devis (statut + montants + reste à payer) → Déroulé pose générique (PAC/clim/PV/adoucisseur…) → Contact
- ✅ 2 clients mock réels (VOISIN C1044, HALLVAXHIU C1053) — data tirée de l'API IF live
- ✅ Mapping `type devis → catégorie produit` pour le déroulé (`lib/prestation.ts`)
- ✅ Charte brand Kozéo (vert/navy/orange + Inter Tight)
- ✅ Headers sécurité : `noindex`, `X-Frame-Options DENY`, `Referrer-Policy strict-origin-when-cross-origin`

## Ce qui ne marche pas encore (= à itérer)

### 1. Connexion Inter-Fast réelle

Le fichier `src/lib/interfast.ts` a des hypothèses d'endpoints REST commentées (`/clients/{id}`, `/billing/quotations?client={id}`, `/events?client={id}`). À valider :

- soit en regardant le code `lib/interfast.ts` du repo `kozeo-clients` existant (rdv.kozeo.fr en prod)
- soit en consultant la doc IF officielle
- soit en testant l'API live avec un token IF

Tant que `IF_API_KEY` n'est pas set, le mock répond. Quand on aura la shape réelle, c'est ~30 min pour brancher le `normalizeBundle()`.

### 2. PDF devis téléchargeable

Actuellement `pdfUrl: null` dans le mock. L'API IF renvoie une URL d'attachement type `/v1/billing/quotations/{id}/files/{fileId}`. À tester si cette URL est joignable côté client avec auth, ou si elle nécessite un proxy serveur (route API qui ré-injecte la clé).

### 3. Mail d'envoi du lien (auto via Make)

Pour le MVP de ce soir, **génération manuelle** via `npm run gen-token C1044` → on colle l'URL dans un mail à la main.

Quand on voudra automatiser :
- Webhook Inter-Fast à définir : `quotation.signed` ou `event.created` avec type "installation"
- Module Make `Tools / Custom function` qui signe le token (même payload, même secret)
- Module Brevo ou Gmail Workspace qui envoie le mail avec le lien

C'est la Phase 3 (post-MVP). Ne pas la coder ce soir.

### 4. Auth email + code postal (alternative au lien magique)

Tu m'as suggéré ce pattern. Sur le principe c'est faisable mais ~3-4× plus de code que le lien magique :

- Page `/login` (email + CP)
- Route handler `/api/login` qui hash email+CP, compare à IF (lookup client par email → vérifie CP), génère un cookie session signé
- Middleware qui check le cookie sur `/dashboard/*`
- Rate-limit anti brute-force (5 tentatives / 15 min par IP)
- Gestion "mot de passe oublié" — sauf qu'ici c'est un CP… donc si le client a déménagé, il est bloqué

**Recommandation** : on reste sur lien magique pour cette base. Si tu veux email+CP plus tard, on peut ajouter une route `/login` qui, sur succès, **génère un lien magique court (5 min)** et l'envoie au mail enregistré — sans cookie, sans session. Pattern hybride : familier pour le client (login classique) sans la complexité du serveur d'authentification.

## Structure

```
kozeo-client/
├── package.json
├── tsconfig.json
├── next.config.js                      ← headers sécurité + noindex global
├── tailwind.config.ts                  ← palette brand Kozéo
├── postcss.config.js
├── .env.local.example                  ← TOKEN_SECRET + IF_API_KEY
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← Inter Tight + meta noindex
│   │   ├── page.tsx                    ← landing minimale "lien magique requis"
│   │   ├── globals.css                 ← Tailwind + base brand
│   │   └── c/
│   │       └── [token]/
│   │           ├── page.tsx            ← Server Component qui assemble tout
│   │           └── not-found.tsx       ← Compte introuvable
│   ├── components/
│   │   ├── ui/
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   └── section.tsx
│   │   ├── client-header.tsx
│   │   ├── interventions-list.tsx
│   │   ├── devis-list.tsx
│   │   ├── deroule-pose.tsx
│   │   └── contact-bloc.tsx
│   └── lib/
│       ├── token.ts                    ← HMAC SHA-256 sign/verify
│       ├── types.ts                    ← Client, Devis, Intervention, ClientBundle
│       ├── interfast-mock.ts           ← data réelle VOISIN + HALLVAXHIU
│       ├── interfast.ts                ← fetch API IF (TODO endpoints) + fallback mock
│       ├── prestation.ts               ← mapping catégorie + déroulé pose
│       └── utils.ts                    ← cn(), formatEUR, formatDateLong, formatTimeRange
└── scripts/
    └── gen-client-token.mjs            ← CLI gen lien (pour tests + envois manuels)
```

## Variables d'env

| Variable | Type | Rôle |
|---|---|---|
| `TOKEN_SECRET` | privée (serveur uniquement) | Secret HMAC pour signer/vérifier les liens magiques. **Doit être identique côté Make** quand on automatisera l'envoi. |
| `IF_API_KEY` | privée | Clé API Inter-Fast. Si vide → mode mock. |
| `IF_API_BASE` | privée | `https://api.interfast.io/v1` (à ajuster si autre). |

## Pour mettre en prod (quand tu seras prêt)

1. `git init` dans ce dossier, push vers `gerome-kozeo/kozeo-client` (repo vide existant).
2. Vercel : import projet → assigner env vars (`TOKEN_SECRET`, `IF_API_KEY`, `IF_API_BASE`).
3. Custom domain `client.kozeo.fr` : CNAME OVH `client` → `cname.vercel-dns.com.` + add domain Vercel.
4. Test E2E sur un vrai client (générer un lien via le script, ouvrir l'URL, vérifier).
5. Quand l'API IF réelle sera branchée : tester sur 1-2 vrais clients qui ont signé récemment.

## Liens

- [Brief origine espace client (vault)](`Projects/idee-espace-client-signataires.md`)
- [Socle technique `rdv.kozeo.fr` (vault)](`Projects/2026-05-09-app-clients-rdv-build.md`)
- [Brand DNA Kozéo (vault)](`Context/brand-dna-kozeo.md`)
