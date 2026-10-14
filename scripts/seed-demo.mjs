import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc, writeBatch } from "firebase/firestore";
import { en, ne } from "../src/lib/i18n.ts";

const firebaseConfig = {
  apiKey: "AIzaSyDDZOy93bOkcGfnh9zbpNXV5KBXY59YjSk",
  authDomain: "daak-nepal.firebaseapp.com",
  projectId: "daak-nepal",
  storageBucket: "daak-nepal.firebasestorage.app",
  messagingSenderId: "717607878722",
  appId: "1:717607878722:web:58e25b5523c384845e2ddb",
};

const password = "DaakDemo2026";

const address = {
  daakCode: "DAAK-NP-CW32DN",
  province: "Bagmati Province",
  district: "Kathmandu",
  municipality: "Kathmandu Metropolitan City",
  ward: 26,
  areaTole: "Lainchaur",
  streetName: "Lainchaur Marg",
  houseNumber: "12B",
  landmark: "Near Lainchaur",
  residenceType: "House",
  isFamilyShared: true,
  arrivalPoint: "Main Gate",
  arrivalNotes: "Blue gate, third floor, near the school.",
  coordinates: { lat: 27.7172, lng: 85.3168, accuracyMeters: 4 },
  createdAt: new Date().toISOString(),
};

const privacy = {
  shareFullAddress: true,
  showExactCoordinates: true,
  allowFamilyLookup: true,
};

const users = [
  {
    phone: "+977-9841001122",
    email: "trailokya@daak.np",
    fullName: "Trailokya Bhattarai",
    role: "citizen",
    address,
  },
  {
    phone: "+977-9801112233",
    email: "sita@daak.np",
    fullName: "Sita Sharma",
    role: "business",
    address: null,
  },
  {
    phone: "+977-9811223344",
    email: "ramesh@daak.np",
    fullName: "Ramesh Gurung",
    role: "rider",
    address: null,
  },
  {
    phone: "+977-9821334455",
    email: "anita@daak.np",
    fullName: "Anita Shrestha",
    role: "government",
    address: null,
  },
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function authEmail(phone) {
  return `${phone.replace(/\D/g, "")}@daak-nepal.app`;
}

async function ensureUser(person) {
  const email = authEmail(person.phone);
  let credential;
  try {
    credential = await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error?.code !== "auth/email-already-in-use") throw error;
    credential = await signInWithEmailAndPassword(auth, email, password);
  }
  await credential.user.getIdToken(true);
  const now = Date.now();
  const profile = {
    id: credential.user.uid,
    fullName: person.fullName,
    phone: person.phone,
    email: person.email,
    role: person.role,
    roles: [person.role],
    language: "en",
    isVerified: true,
  };
  const activities = [
    ...(person.address
      ? [{ id: `${credential.user.uid}-address`, key: "address_created", at: new Date(now - 60_000).toISOString(), meta: person.address.daakCode }]
      : []),
    { id: `${credential.user.uid}-verified`, key: "phone_verified", at: new Date(now - 180_000).toISOString() },
    { id: `${credential.user.uid}-created`, key: "account_created", at: new Date(now - 240_000).toISOString() },
  ];
  await setDoc(doc(db, "users", credential.user.uid), {
    profile,
    address: person.address,
    activities,
    privacy,
    updatedAt: new Date().toISOString(),
  });
  console.log(`${person.role}\t${person.phone}\t${password}`);
}

function translationRows(locale, tree, prefix = "") {
  const list = [];
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") list.push(...translationRows(locale, value, path));
    else list.push({ locale, key: path, value: String(value) });
  }
  return list;
}

async function seedTranslations() {
  const rows = [...translationRows("en", en), ...translationRows("ne", ne)];
  for (let index = 0; index < rows.length; index += 400) {
    const batch = writeBatch(db);
    for (const row of rows.slice(index, index + 400)) {
      const id = `${row.locale}__${row.key.replaceAll(".", "__")}`;
      batch.set(doc(db, "translations", id), row);
    }
    await batch.commit();
  }
  console.log(`translations\t${rows.length}`);
}

for (const person of users) {
  await ensureUser(person);
}
await seedTranslations();
process.exit(0);
