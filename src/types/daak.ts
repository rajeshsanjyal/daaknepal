export const ROLES = ["citizen", "business", "rider", "government"] as const;
export type Role = (typeof ROLES)[number];

export const LANGUAGES = ["en", "ne"] as const;
export type Language = (typeof LANGUAGES)[number];

export const RESIDENCE_TYPES = [
  "House",
  "Apartment",
  "Hostel",
  "Rental Room",
  "Shared Residence",
  "Other",
] as const;
export type ResidenceType = (typeof RESIDENCE_TYPES)[number];

export const ARRIVAL_POINTS = [
  "Main Gate",
  "Front Door",
  "Apartment Lobby",
  "Building Entrance",
  "Reception",
  "Other",
] as const;
export type ArrivalPoint = (typeof ARRIVAL_POINTS)[number];

export interface DaakProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: Role;
  roles: Role[];
  language: Language;
  isVerified: boolean;
}

export interface DaakCoordinates {
  lat: number;
  lng: number;
  accuracyMeters: number;
}

export interface DaakAddress {
  daakCode: string;
  province: string;
  district: string;
  municipality: string;
  ward: number;
  areaTole: string;
  streetName?: string;
  houseNumber?: string;
  landmark: string;
  residenceType: ResidenceType;
  isFamilyShared: boolean;
  arrivalPoint: ArrivalPoint;
  arrivalNotes?: string;
  coordinates: DaakCoordinates;
  qrCodeDataUrl?: string;
  createdAt: string;
}

export function isRole(value: string | null): value is Role {
  return ROLES.some((role) => role === value);
}

export const ACTIVITY_KEYS = [
  "account_created",
  "phone_verified",
  "address_created",
  "code_copied",
  "address_shared",
  "qr_opened",
  "navigation_opened",
  "role_switched",
  "role_attached",
] as const;
export type ActivityKey = (typeof ACTIVITY_KEYS)[number];

export interface ActivityItem {
  id: string;
  key: ActivityKey;
  at: string;
  meta?: string;
}

export interface PrivacySettings {
  shareFullAddress: boolean;
  showExactCoordinates: boolean;
  allowFamilyLookup: boolean;
}
