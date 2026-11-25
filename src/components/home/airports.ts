export interface AirportEntry {
  name: string;
  code: string;
  fullName: string;
}

// The six airports shown on the homepage. Names and codes come from the dashboard settings
// (airport_name_N / airport_code_N); the fallbacks are used only when a field is empty.
const FALLBACKS: Array<[string, string]> = [
  ["Heathrow", "LHR"],
  ["Gatwick", "LGW"],
  ["Luton", "LTN"],
  ["Stansted", "STN"],
  ["London City", "LCY"],
  ["Southend", "SEN"],
];

export function getAirports(settings?: any): AirportEntry[] {
  return FALLBACKS.map(([fallbackName, fallbackCode], index) => {
    const name = settings?.[`airport_name_${index + 1}`] || fallbackName;
    const code = settings?.[`airport_code_${index + 1}`] || fallbackCode;
    return { name, code, fullName: `${name} Airport (${code})` };
  });
}

// "Birmingham (BHX)" -> "Birmingham": the place name without a bracketed code.
export function placeName(name: string): string {
  return String(name || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
}
