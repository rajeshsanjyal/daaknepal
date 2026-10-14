import type { Language } from "@/types/daak";

export interface Municipality {
  name: string;
  nameNe: string;
  wards: number;
}

export interface District {
  name: string;
  nameNe: string;
  municipalities: Municipality[];
}

export interface Province {
  name: string;
  nameNe: string;
  districts: District[];
}

export const ADMIN: Province[] = [
  {
    name: "Koshi Province",
    nameNe: "कोशी प्रदेश",
    districts: [
      {
        name: "Morang",
        nameNe: "मोरङ",
        municipalities: [
          { name: "Biratnagar Metropolitan City", nameNe: "विराटनगर महानगरपालिका", wards: 19 },
        ],
      },
    ],
  },
  {
    name: "Madhesh Province",
    nameNe: "मधेश प्रदेश",
    districts: [
      {
        name: "Parsa",
        nameNe: "पर्सा",
        municipalities: [
          { name: "Birgunj Metropolitan City", nameNe: "वीरगन्ज महानगरपालिका", wards: 32 },
        ],
      },
    ],
  },
  {
    name: "Bagmati Province",
    nameNe: "बागमती प्रदेश",
    districts: [
      {
        name: "Kathmandu",
        nameNe: "काठमाडौं",
        municipalities: [
          { name: "Kathmandu Metropolitan City", nameNe: "काठमाडौं महानगरपालिका", wards: 32 },
          { name: "Kirtipur Municipality", nameNe: "कीर्तिपुर नगरपालिका", wards: 10 },
          { name: "Budhanilkantha Municipality", nameNe: "बुढानिलकण्ठ नगरपालिका", wards: 13 },
        ],
      },
      {
        name: "Lalitpur",
        nameNe: "ललितपुर",
        municipalities: [
          { name: "Lalitpur Metropolitan City", nameNe: "ललितपुर महानगरपालिका", wards: 29 },
        ],
      },
      {
        name: "Bhaktapur",
        nameNe: "भक्तपुर",
        municipalities: [
          { name: "Bhaktapur Municipality", nameNe: "भक्तपुर नगरपालिका", wards: 10 },
        ],
      },
    ],
  },
  {
    name: "Gandaki Province",
    nameNe: "गण्डकी प्रदेश",
    districts: [
      {
        name: "Kaski",
        nameNe: "कास्की",
        municipalities: [
          { name: "Pokhara Metropolitan City", nameNe: "पोखरा महानगरपालिका", wards: 33 },
        ],
      },
    ],
  },
  {
    name: "Lumbini Province",
    nameNe: "लुम्बिनी प्रदेश",
    districts: [
      {
        name: "Rupandehi",
        nameNe: "रुपन्देही",
        municipalities: [
          { name: "Butwal Sub-Metropolitan City", nameNe: "बुटवल उपमहानगरपालिका", wards: 19 },
        ],
      },
    ],
  },
  {
    name: "Karnali Province",
    nameNe: "कर्णाली प्रदेश",
    districts: [
      {
        name: "Surkhet",
        nameNe: "सुर्खेत",
        municipalities: [
          { name: "Birendranagar Municipality", nameNe: "वीरेन्द्रनगर नगरपालिका", wards: 16 },
        ],
      },
    ],
  },
  {
    name: "Sudurpashchim Province",
    nameNe: "सुदूरपश्चिम प्रदेश",
    districts: [
      {
        name: "Kailali",
        nameNe: "कैलाली",
        municipalities: [
          { name: "Dhangadhi Sub-Metropolitan City", nameNe: "धनगढी उपमहानगरपालिका", wards: 19 },
        ],
      },
    ],
  },
];

export function provinceByName(name: string) {
  return ADMIN.find((item) => item.name === name) ?? ADMIN[2];
}

export function districtByName(provinceName: string, districtName: string) {
  const province = provinceByName(provinceName);
  return province.districts.find((item) => item.name === districtName) ?? province.districts[0];
}

export function municipalityByName(provinceName: string, districtName: string, municipalityName: string) {
  const district = districtByName(provinceName, districtName);
  return district.municipalities.find((item) => item.name === municipalityName) ?? district.municipalities[0];
}

export function adminLabel(name: string, language: Language) {
  for (const province of ADMIN) {
    if (province.name === name) return language === "ne" ? province.nameNe : province.name;
    for (const district of province.districts) {
      if (district.name === name) return language === "ne" ? district.nameNe : district.name;
      for (const municipality of district.municipalities) {
        if (municipality.name === name) return language === "ne" ? municipality.nameNe : municipality.name;
      }
    }
  }
  return name;
}
