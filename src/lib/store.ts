import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FirebaseError } from "firebase/app";
import { registerAccount, signInAccount, signOutAccount, writeAccount, type AccountRecord } from "@/lib/account";
import { firebaseAuth } from "@/lib/firebase";
import { generateDaakCode, roundCoord } from "@/lib/format";
import type {
  ActivityItem,
  ActivityKey,
  ArrivalPoint,
  DaakAddress,
  DaakProfile,
  Language,
  PrivacySettings,
  ResidenceType,
  Role,
} from "@/types/daak";

export type { ActivityItem, ActivityKey, PrivacySettings };

export interface PendingRegistration {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: Role;
  language: Language;
}

export interface AddressDraft {
  province: string;
  district: string;
  municipality: string;
  ward: number;
  areaTole: string;
  streetName: string;
  houseNumber: string;
  landmark: string;
  residenceType: ResidenceType;
  isFamilyShared: boolean;
  arrivalPoint: ArrivalPoint;
  arrivalNotes: string;
  lat: number;
  lng: number;
  accuracyMeters: number;
}

interface DaakState {
  hydrated: boolean;
  language: Language;
  profile: DaakProfile | null;
  pending: PendingRegistration | null;
  otp: string;
  otpSentAt: number | null;
  address: DaakAddress | null;
  draft: AddressDraft;
  activities: ActivityItem[];
  privacy: PrivacySettings;
  setLanguage: (language: Language) => void;
  beginRegistration: (pending: PendingRegistration) => "ok" | "taken";
  updatePendingPhone: (phone: string) => void;
  resendOtp: () => void;
  verifyOtp: (code: string) => Promise<"ok" | "bad-code" | "taken" | "offline">;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateDraft: (patch: Partial<AddressDraft>) => void;
  provisionAddress: () => DaakAddress;
  pushActivity: (key: ActivityKey, meta?: string) => void;
  updatePrivacy: (patch: Partial<PrivacySettings>) => void;
  switchRole: (role: Role) => void;
  attachRole: (role: Role) => void;
}

const defaultPrivacy = (): PrivacySettings => ({
  shareFullAddress: true,
  showExactCoordinates: true,
  allowFamilyLookup: true,
});

export const defaultDraft = (): AddressDraft => ({
  province: "Bagmati Province",
  district: "Kathmandu",
  municipality: "Kathmandu Metropolitan City",
  ward: 26,
  areaTole: "",
  streetName: "",
  houseNumber: "",
  landmark: "",
  residenceType: "House",
  isFamilyShared: false,
  arrivalPoint: "Main Gate",
  arrivalNotes: "",
  lat: 27.7172,
  lng: 85.3168,
  accuracyMeters: 4,
});

function makeOtp() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(100000 + (bytes[0] % 900000));
}

function activity(key: ActivityKey, meta?: string): ActivityItem {
  return { id: crypto.randomUUID(), key, at: new Date().toISOString(), meta };
}

function withActivity(items: ActivityItem[], key: ActivityKey, meta?: string) {
  return [activity(key, meta), ...items].slice(0, 40);
}

export const useDaakStore = create<DaakState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      language: "en",
      profile: null,
      pending: null,
      otp: "",
      otpSentAt: null,
      address: null,
      draft: defaultDraft(),
      activities: [],
      privacy: defaultPrivacy(),
      setLanguage: (language) => {
        set((state) => ({
          language,
          profile: state.profile ? { ...state.profile, language } : state.profile,
        }));
        publish();
      },
      beginRegistration: (pending) => {
        if (get().profile?.phone === pending.phone) return "taken";
        set({ pending, otp: makeOtp(), otpSentAt: Date.now(), language: pending.language });
        return "ok";
      },
      updatePendingPhone: (phone) => {
        const pending = get().pending;
        if (!pending) return;
        set({ pending: { ...pending, phone }, otp: makeOtp(), otpSentAt: Date.now() });
      },
      resendOtp: () => set({ otp: makeOtp(), otpSentAt: Date.now() }),
      verifyOtp: async (code) => {
        const state = get();
        if (!state.pending || code !== state.otp) return "bad-code";
        const created = activity("account_created");
        const verified = activity("phone_verified");
        const activities = [verified, created, ...state.activities].slice(0, 40);
        const profile: DaakProfile = {
          id: "pending",
          fullName: state.pending.fullName,
          phone: state.pending.phone,
          email: state.pending.email,
          role: state.pending.role,
          roles: [state.pending.role],
          language: state.pending.language,
          isVerified: true,
        };
        try {
          const user = await registerAccount(
            { profile, address: null, activities, privacy: state.privacy },
            state.pending.password,
          );
          set({
            profile: { ...profile, id: user.uid },
            pending: null,
            otp: "",
            otpSentAt: null,
            address: null,
            language: state.pending.language,
            activities,
          });
          return "ok";
        } catch (error) {
          return authFailure(error);
        }
      },
      login: async (phone, password) => {
        try {
          set(sessionFrom(await signInAccount(phone, password)));
          return true;
        } catch {
          return false;
        }
      },
      logout: () => {
        void signOutAccount().catch(() => undefined);
        set((state) => ({
          profile: null,
          pending: null,
          otp: "",
          otpSentAt: null,
          address: null,
          draft: defaultDraft(),
          activities: [],
          privacy: defaultPrivacy(),
          language: state.language,
        }));
      },
      updateDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
      provisionAddress: () => {
        const state = get();
        const draft = state.draft;
        const address: DaakAddress = {
          daakCode: generateDaakCode(
            `${state.profile?.id ?? "daak"}|${draft.lat}|${draft.lng}|${draft.houseNumber}|${Date.now()}`,
          ),
          province: draft.province,
          district: draft.district,
          municipality: draft.municipality,
          ward: draft.ward,
          areaTole: draft.areaTole,
          streetName: draft.streetName || undefined,
          houseNumber: draft.houseNumber || undefined,
          landmark: draft.landmark,
          residenceType: draft.residenceType,
          isFamilyShared: draft.isFamilyShared,
          arrivalPoint: draft.arrivalPoint,
          arrivalNotes: draft.arrivalNotes || undefined,
          coordinates: {
            lat: roundCoord(draft.lat),
            lng: roundCoord(draft.lng),
            accuracyMeters: draft.accuracyMeters,
          },
          createdAt: new Date().toISOString(),
        };
        set({ address, activities: withActivity(state.activities, "address_created", address.daakCode) });
        publish();
        return address;
      },
      pushActivity: (key, meta) => {
        set((state) => ({ activities: withActivity(state.activities, key, meta) }));
        publish();
      },
      updatePrivacy: (patch) => {
        set((state) => ({ privacy: { ...state.privacy, ...patch } }));
        publish();
      },
      switchRole: (role) => {
        const profile = get().profile;
        if (!profile?.roles.includes(role) || profile.role === role) return;
        set({
          profile: { ...profile, role },
          activities: withActivity(get().activities, "role_switched", role),
        });
        publish();
      },
      attachRole: (role) => {
        const profile = get().profile;
        if (!profile || profile.roles.includes(role)) return;
        set({
          profile: { ...profile, roles: [...profile.roles, role], role },
          activities: withActivity(get().activities, "role_attached", role),
        });
        publish();
      },
    }),
    {
      name: "daak-nepal",
      version: 2,
      skipHydration: true,
      migrate: (persisted) => {
        const saved = (persisted ?? {}) as { language?: Language; draft?: Partial<AddressDraft> };
        return {
          language: saved.language === "ne" ? "ne" : "en",
          draft: { ...defaultDraft(), ...saved.draft },
        };
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        draft: state.draft,
      }),
    },
  ),
);

function publish() {
  const user = firebaseAuth().currentUser;
  const state = useDaakStore.getState();
  if (!user || !state.profile) return;
  void writeAccount(user.uid, {
    profile: state.profile,
    address: state.address,
    activities: state.activities,
    privacy: state.privacy,
  }).catch(() => undefined);
}

function sessionFrom(record: AccountRecord) {
  const address = record.address;
  return {
    profile: record.profile,
    address,
    activities: record.activities,
    privacy: record.privacy,
    language: record.profile.language,
    pending: null,
    otp: "",
    otpSentAt: null as number | null,
    draft: address
      ? {
          ...defaultDraft(),
          province: address.province,
          district: address.district,
          municipality: address.municipality,
          ward: address.ward,
          areaTole: address.areaTole,
          streetName: address.streetName ?? "",
          houseNumber: address.houseNumber ?? "",
          landmark: address.landmark,
          residenceType: address.residenceType,
          isFamilyShared: address.isFamilyShared,
          arrivalPoint: address.arrivalPoint,
          arrivalNotes: address.arrivalNotes ?? "",
          lat: address.coordinates.lat,
          lng: address.coordinates.lng,
          accuracyMeters: address.coordinates.accuracyMeters,
        }
      : defaultDraft(),
  };
}

function authFailure(error: unknown): "taken" | "offline" {
  if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") return "taken";
  return "offline";
}
