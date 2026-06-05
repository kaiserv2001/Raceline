// Converts an ISO 3166-1 alpha-3 code to a flag emoji via alpha-2 intermediate.
// Flag emoji = two Unicode Regional Indicator Symbols (U+1F1E6–U+1F1FF).
const alpha3ToAlpha2: Record<string, string> = {
  AFG: "AF", ALB: "AL", DZA: "DZ", AND: "AD", AGO: "AO", ARG: "AR",
  ARM: "AM", AUS: "AU", AUT: "AT", AZE: "AZ", BHS: "BS", BHR: "BH",
  BGD: "BD", BLR: "BY", BEL: "BE", BLZ: "BZ", BEN: "BJ", BTN: "BT",
  BOL: "BO", BIH: "BA", BWA: "BW", BRA: "BR", BRN: "BN", BGR: "BG",
  BFA: "BF", BDI: "BI", CPV: "CV", KHM: "KH", CMR: "CM", CAN: "CA",
  CAF: "CF", TCD: "TD", CHL: "CL", CHN: "CN", COL: "CO", COD: "CD",
  CRI: "CR", HRV: "HR", CUB: "CU", CYP: "CY", CZE: "CZ", DNK: "DK",
  DJI: "DJ", DOM: "DO", ECU: "EC", EGY: "EG", SLV: "SV", EST: "EE",
  ETH: "ET", FJI: "FJ", FIN: "FI", FRA: "FR", GAB: "GA", GMB: "GM",
  GEO: "GE", DEU: "DE", GHA: "GH", GRC: "GR", GTM: "GT", GIN: "GN",
  GUY: "GY", HTI: "HT", HND: "HN", HUN: "HU", ISL: "IS", IND: "IN",
  IDN: "ID", IRN: "IR", IRQ: "IQ", IRL: "IE", ISR: "IL", ITA: "IT",
  JAM: "JM", JPN: "JP", JOR: "JO", KAZ: "KZ", KEN: "KE", PRK: "KP",
  KOR: "KR", KWT: "KW", KGZ: "KG", LAO: "LA", LVA: "LV", LBN: "LB",
  LSO: "LS", LBR: "LR", LBY: "LY", LIE: "LI", LTU: "LT", LUX: "LU",
  MDG: "MG", MWI: "MW", MYS: "MY", MDV: "MV", MLI: "ML", MLT: "MT",
  MRT: "MR", MUS: "MU", MEX: "MX", MDA: "MD", MCO: "MC", MNG: "MN",
  MNE: "ME", MAR: "MA", MOZ: "MZ", MMR: "MM", NAM: "NA", NPL: "NP",
  NLD: "NL", NZL: "NZ", NIC: "NI", NER: "NE", NGA: "NG", NOR: "NO",
  OMN: "OM", PAK: "PK", PAN: "PA", PNG: "PG", PRY: "PY", PER: "PE",
  PHL: "PH", POL: "PL", PRT: "PT", QAT: "QA", ROU: "RO", RUS: "RU",
  RWA: "RW", SAU: "SA", SEN: "SN", SRB: "RS", SLE: "SL", SGP: "SG",
  SVK: "SK", SVN: "SI", SOM: "SO", ZAF: "ZA", ESP: "ES", LKA: "LK",
  SDN: "SD", SWE: "SE", CHE: "CH", SYR: "SY", TWN: "TW", TJK: "TJ",
  TZA: "TZ", THA: "TH", TGO: "TG", TTO: "TT", TUN: "TN", TUR: "TR",
  TKM: "TM", UGA: "UG", UKR: "UA", ARE: "AE", GBR: "GB", USA: "US",
  URY: "UY", UZB: "UZ", VEN: "VE", VNM: "VN", YEM: "YE", ZMB: "ZM",
  ZWE: "ZW",
};

function alpha2ToEmoji(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export function countryFlag(alpha3: string): string {
  const alpha2 = alpha3ToAlpha2[alpha3.toUpperCase()];
  if (!alpha2) return "🏳";
  return alpha2ToEmoji(alpha2);
}

// Short display name for a nationality code
const countryNames: Record<string, string> = {
  ITA: "Italy", NOR: "Norway", BRA: "Brazil", IND: "India", BEL: "Belgium",
  JPN: "Japan", MEX: "Mexico", ZAF: "South Africa", CZE: "Czech Republic",
  AUS: "Australia", ESP: "Spain", FRA: "France", GBR: "Britain", DEU: "Germany",
  ARG: "Argentina", PRT: "Portugal", NLD: "Netherlands", FIN: "Finland",
  AUT: "Austria", USA: "USA",
};

export function countryName(alpha3: string): string {
  return countryNames[alpha3.toUpperCase()] ?? alpha3;
}

// Full country name → flag emoji (for calendar/race data that stores full names)
const nameToAlpha2: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD",
  "Angola": "AO", "Argentina": "AR", "Armenia": "AM", "Australia": "AU",
  "Austria": "AT", "Azerbaijan": "AZ", "Bahrain": "BH", "Bangladesh": "BD",
  "Belarus": "BY", "Belgium": "BE", "Bolivia": "BO", "Bosnia": "BA",
  "Botswana": "BW", "Brazil": "BR", "Bulgaria": "BG", "Canada": "CA",
  "Chile": "CL", "China": "CN", "Colombia": "CO", "Costa Rica": "CR",
  "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czech Republic": "CZ",
  "Denmark": "DK", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG",
  "Estonia": "EE", "Ethiopia": "ET", "Finland": "FI", "France": "FR",
  "Georgia": "GE", "Germany": "DE", "Ghana": "GH", "Greece": "GR",
  "Guatemala": "GT", "Hungary": "HU", "Iceland": "IS", "India": "IN",
  "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE",
  "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP",
  "Jordan": "JO", "Kazakhstan": "KZ", "Kenya": "KE", "Kuwait": "KW",
  "Latvia": "LV", "Lebanon": "LB", "Libya": "LY", "Lithuania": "LT",
  "Luxembourg": "LU", "Malaysia": "MY", "Malta": "MT", "Mexico": "MX",
  "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME",
  "Morocco": "MA", "Netherlands": "NL", "New Zealand": "NZ", "Nigeria": "NG",
  "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Panama": "PA",
  "Paraguay": "PY", "Peru": "PE", "Philippines": "PH", "Poland": "PL",
  "Portugal": "PT", "Qatar": "QA", "Romania": "RO", "Russia": "RU",
  "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS", "Singapore": "SG",
  "Slovakia": "SK", "Slovenia": "SI", "Somalia": "SO", "South Africa": "ZA",
  "Spain": "ES", "Sri Lanka": "LK", "Sweden": "SE", "Switzerland": "CH",
  "Syria": "SY", "Taiwan": "TW", "Thailand": "TH", "Tunisia": "TN",
  "Turkey": "TR", "Ukraine": "UA", "United Arab Emirates": "AE",
  "United Kingdom": "GB", "United States": "US", "Uruguay": "UY",
  "Venezuela": "VE", "Vietnam": "VN", "Zimbabwe": "ZW",
};

export function countryNameFlag(name: string): string {
  const alpha2 = nameToAlpha2[name];
  if (!alpha2) return "🏳";
  return alpha2ToEmoji(alpha2);
}
