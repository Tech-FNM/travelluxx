import { contentText } from "../../content/useContent";

export interface AirportEntry {
  name: string;
  code: string;
  fullName: string;
}

// The six airports shown on the homepage. Names and codes are edited in the dashboard
// (Site Content → Homepage → Airports band: airport_name_N / airport_code_N); the defaults declared
// in src/content/sections/homeCoverage.ts are used only when a field is empty.
const AIRPORT_COUNT = 6;

export function getAirports(settings?: any): AirportEntry[] {
  return Array.from({ length: AIRPORT_COUNT }, (_, index) => {
    const name = contentText(settings, `airport_name_${index + 1}`);
    const code = contentText(settings, `airport_code_${index + 1}`);
    return { name, code, fullName: `${name} Airport (${code})` };
  });
}

// "Birmingham (BHX)" -> "Birmingham": the place name without a bracketed code.
export function placeName(name: string): string {
  return String(name || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
}
