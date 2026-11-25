// UK phone number helpers shared by the header, footer and hero.
//
// Numbers are stored in the dashboard as digits, usually in international form ("441217140876"),
// but "0121 714 0876", "+44 (0)121 7140876" or "00441217140876" are accepted too.

/** The national significant number (no country code, no leading 0), or null if it is not a UK number. */
function ukNational(raw: string): string | null {
  let digits = String(raw || "").replace(/\(0\)/g, "").replace(/\D/g, "");
  if (digits.startsWith("0044")) digits = digits.slice(4);
  else if (digits.startsWith("44")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  else return null;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === 10 || digits.length === 9 ? digits : null;
}

/**
 * Formats a UK number for display in international form, grouped the way UK numbers are written:
 *   0121 / 0113 / 0161 … (3-digit area codes)  → +44 121 714 0876
 *   020 / 023 / 024 / 028 / 029 (2-digit)       → +44 20 7946 0018
 *   07… mobiles                                → +44 7700 900123
 *   03 / 08 / 09 non-geographic                → +44 800 123 4567
 *   other 01… (4-digit area codes)             → +44 1564 123456
 * Anything that is not a recognisable UK number is returned unchanged.
 */
export function formatUkPhone(raw: string | number | null | undefined): string {
  const input = String(raw ?? "").trim();
  const n = ukNational(input);
  if (!n) return input;
  if (n.length === 10) {
    if (n.startsWith("2")) return `+44 ${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6)}`;
    if (/^1(1\d|\d1)/.test(n)) return `+44 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
    if (n.startsWith("7")) return `+44 ${n.slice(0, 4)} ${n.slice(4)}`;
    if (/^[389]/.test(n)) return `+44 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
    return `+44 ${n.slice(0, 4)} ${n.slice(4)}`;
  }
  // 9-digit numbers (a few 01xxx areas and 0800 numbers)
  return `+44 ${n.slice(0, 4)} ${n.slice(4)}`;
}

/** A tel: link for the number (international form for UK numbers). */
export function phoneHref(raw: string | number | null | undefined): string {
  const input = String(raw ?? "").trim();
  const n = ukNational(input);
  if (n) return `tel:+44${n}`;
  const digits = input.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}
