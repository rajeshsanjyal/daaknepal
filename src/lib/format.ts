import { adminLabel } from "@/lib/admin";
import type { DaakAddress, Language } from "@/types/daak";

export function roundCoord(value: number) {
  return Math.round(value * 1e6) / 1e6;
}

export function formatCoordinate(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function daakQrValue(address: Pick<DaakAddress, "daakCode" | "coordinates">) {
  return `${address.daakCode}\n${mapsUrl(address.coordinates.lat, address.coordinates.lng)}`;
}

export function generateDaakCode(seed: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  let body = "";
  for (let index = 0; index < 6; index += 1) {
    hash = Math.imul(hash ^ (hash >>> 13), 16777619);
    body += alphabet[Math.abs(hash) % alphabet.length];
  }
  return `DAAK-NP-${body}`;
}

export function isInNepal(lat: number, lng: number) {
  return lat >= 26.3 && lat <= 30.45 && lng >= 80.05 && lng <= 88.2;
}

export function normalizePhone(input: string) {
  const compact = input.replace(/[\s()-]/g, "");
  if (/^\+977-9[6-8]\d{8}$/.test(compact)) return compact;
  const digits = compact.replace(/\D/g, "");
  const local = digits.startsWith("977") ? digits.slice(3) : digits.replace(/^0/, "");
  if (/^9[6-8]\d{8}$/.test(local)) return `+977-${local}`;
  return input.trim();
}

export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "D";
}

export function locationSummary(address: Pick<DaakAddress, "province" | "district" | "ward" | "areaTole">, language: Language) {
  const ward = language === "ne" ? `वडा ${address.ward}` : `Ward ${address.ward}`;
  return [adminLabel(address.province, language), adminLabel(address.district, language), ward, address.areaTole]
    .filter(Boolean)
    .join(" - ");
}

export function formatWhen(iso: string, language: Language) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return language === "ne" ? "अहिले" : "Just now";
  if (minutes < 60) return language === "ne" ? `${minutes} मिनेट अघि` : `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return language === "ne" ? `${hours} घण्टा अघि` : `${hours} hr ago`;
  return new Intl.DateTimeFormat(language === "ne" ? "ne-NP" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function clock(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${mins}:${String(rest).padStart(2, "0")}`;
}
