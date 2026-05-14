#!/usr/bin/env node
// Usage : TOKEN_SECRET=xxx node scripts/gen-client-token.mjs <clientId>
//         (Optionnel) BASE_URL=https://client.kozeo.fr pour customiser l'URL imprimée.
//
// Imprime sur stdout l'URL complète à coller dans un mail.
// Le payload contient { clientId, iat, type: "c" } signé HMAC-SHA256 avec TOKEN_SECRET.

import { createHmac } from "node:crypto";

const args = process.argv.slice(2);
const clientId = args[0];

if (!clientId) {
  console.error("Usage : TOKEN_SECRET=xxx node scripts/gen-client-token.mjs <clientId>");
  console.error("  Exemple : TOKEN_SECRET=xxx node scripts/gen-client-token.mjs C1044");
  process.exit(1);
}

const secret = process.env.TOKEN_SECRET;
if (!secret || secret.length < 16) {
  console.error("Erreur : TOKEN_SECRET manquant ou trop court (>=16 chars requis).");
  console.error("  Charge-le depuis .env.local : `set -a; source .env.local; set +a` (bash)");
  console.error("                                 ou exporte-le manuellement.");
  process.exit(1);
}

function base64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const payload = { clientId, iat: Math.floor(Date.now() / 1000), type: "c" };
const payloadB64 = base64url(JSON.stringify(payload));
const sig = createHmac("sha256", secret).update(payloadB64).digest();
const token = `${payloadB64}.${base64url(sig)}`;

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const url = `${baseUrl.replace(/\/$/, "")}/c/${token}`;

console.log(url);
