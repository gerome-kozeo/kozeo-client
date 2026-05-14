import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ClientTokenPayload = {
  clientId: string;
  iat: number;
  type: "c";
};

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function getSecret(): string {
  const s = process.env.TOKEN_SECRET;
  if (!s || s.length < 16) {
    throw new Error("TOKEN_SECRET manquant ou trop court (>=16 chars requis).");
  }
  return s;
}

export function signClientToken(clientId: string): string {
  const payload: ClientTokenPayload = {
    clientId,
    iat: Math.floor(Date.now() / 1000),
    type: "c",
  };
  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(payloadB64).digest();
  return `${payloadB64}.${base64url(sig)}`;
}

export type VerifyResult =
  | { ok: true; payload: ClientTokenPayload }
  | { ok: false; reason: "malformed" | "bad_signature" | "expired" | "wrong_type" };

export function verifyClientToken(token: string): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [payloadB64, sigB64] = parts;

  const expected = createHmac("sha256", getSecret()).update(payloadB64).digest();
  const given = fromBase64url(sigB64);
  if (expected.length !== given.length) return { ok: false, reason: "bad_signature" };
  if (!timingSafeEqual(expected, given)) return { ok: false, reason: "bad_signature" };

  let payload: ClientTokenPayload;
  try {
    payload = JSON.parse(fromBase64url(payloadB64).toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (payload.type !== "c") return { ok: false, reason: "wrong_type" };
  if (!payload.clientId || typeof payload.iat !== "number") return { ok: false, reason: "malformed" };

  const age = Math.floor(Date.now() / 1000) - payload.iat;
  if (age > MAX_AGE_SECONDS) return { ok: false, reason: "expired" };

  return { ok: true, payload };
}
