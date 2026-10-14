import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { authEmail, firebaseAuth, firebaseDb } from "@/lib/firebase";
import type { ActivityItem, DaakAddress, DaakProfile, PrivacySettings } from "@/types/daak";

export interface AccountRecord {
  profile: DaakProfile;
  address: DaakAddress | null;
  activities: ActivityItem[];
  privacy: PrivacySettings;
}

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function readAccount(uid: string): Promise<AccountRecord | null> {
  const snap = await getDoc(doc(firebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<AccountRecord>;
  if (!data.profile) return null;
  return {
    profile: data.profile,
    address: data.address ?? null,
    activities: data.activities ?? [],
    privacy: data.privacy ?? {
      shareFullAddress: true,
      showExactCoordinates: true,
      allowFamilyLookup: true,
    },
  };
}

export async function writeAccount(uid: string, record: AccountRecord) {
  await setDoc(doc(firebaseDb(), "users", uid), {
    ...clean(record),
    updatedAt: new Date().toISOString(),
  });
}

export async function registerAccount(record: AccountRecord, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(firebaseAuth(), authEmail(record.profile.phone), password);
  const profile = { ...record.profile, id: credential.user.uid };
  await writeAccount(credential.user.uid, { ...record, profile });
  return credential.user;
}

export async function signInAccount(phone: string, password: string): Promise<AccountRecord> {
  const credential = await signInWithEmailAndPassword(firebaseAuth(), authEmail(phone), password);
  const record = await readAccount(credential.user.uid);
  if (!record) throw new Error("missing-profile");
  return record;
}

export async function signOutAccount() {
  await signOut(firebaseAuth());
}
