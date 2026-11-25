import heroRoadImg from "../../assets/images/hero_background_1786403449488.jpg";
import fleetLuxuryImg from "../../assets/images/fleet_luxury_1786403483244.jpg";
import fleetEconomyImg from "../../assets/images/fleet_economy_1786403470397.jpg";
import fleetFamilyImg from "../../assets/images/fleet_family_1786403496325.jpg";
import transferAirportImg from "../../assets/images/transfer_airport_1786403518712.jpg";
import transferBusinessImg from "../../assets/images/transfer_business_1786403576291.jpg";
import transferStationImg from "../../assets/images/transfer_station_1786403548164.jpg";
import transferPortImg from "../../assets/images/transfer_port_1786403532912.jpg";

/** Helpers shared by the service-area index and detail pages (presentation only). */

export type AreaLike = {
  id?: string;
  slug?: string;
  title?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  imageAlt?: string;
};

// Under Next a static image import is an object ({ src, width, height }); elsewhere it is the URL.
const url = (img: any): string => (typeof img === "string" ? img : img?.src || "");

export const AREA_IMG = {
  road: url(heroRoadImg),
  luxury: url(fleetLuxuryImg),
  economy: url(fleetEconomyImg),
  family: url(fleetFamilyImg),
  airport: url(transferAirportImg),
  business: url(transferBusinessImg),
  station: url(transferStationImg),
  port: url(transferPortImg),
};

/** Photographs used for an area that has no image of its own, in list order. */
const LIST_ROTATION = [
  AREA_IMG.business,
  AREA_IMG.family,
  AREA_IMG.airport,
  AREA_IMG.station,
  AREA_IMG.economy,
  AREA_IMG.port,
];

/** Darker photographs that still read well under a headline. */
const HERO_ROTATION = [AREA_IMG.road, AREA_IMG.business, AREA_IMG.airport, AREA_IMG.family];

/** Photographs for the picture that opens the article on a detail page. */
const ARTICLE_ROTATION = [AREA_IMG.station, AREA_IMG.business, AREA_IMG.family, AREA_IMG.economy, AREA_IMG.airport];

// The CMS seeds every new area with the same stock photo (a small blue hatchback). It says nothing
// about the service, so an area that still carries it is treated as having no image of its own.
const STOCK_PLACEHOLDER = "photo-1549317661-bd32c8ce0db2";

export function hasOwnImage(src: unknown): src is string {
  return typeof src === "string" && src.trim() !== "" && !src.includes(STOCK_PLACEHOLDER);
}

const norm = (value: unknown) => String(value || "").trim().toLowerCase();

/** "chauffeur-solihull" and its alias "solihull" both give "solihull". */
export const bareSlug = (slug: unknown) => norm(slug).replace(/^chauffeur-/, "");

/** "Chauffeur Coventry" -> "Coventry". The place itself, for large display type and breadcrumbs. */
export function areaPlaceName(area: AreaLike | null | undefined): string {
  const title = String(area?.title || "").trim();
  return title.replace(/^chauffeur\s+/i, "").trim() || title;
}

/**
 * The API lists every area twice: once under its "chauffeur-…" slug and once under a short alias.
 * Two records are the same area when their slugs match once the prefix is removed, or when their
 * titles match. The "chauffeur-…" record is the one that is kept.
 */
export function dedupeAreas<T extends AreaLike>(list: T[] | null | undefined): T[] {
  const kept: T[] = [];
  for (const area of Array.isArray(list) ? list : []) {
    if (!area) continue;
    const at = kept.findIndex(
      (other) =>
        (bareSlug(area.slug) !== "" && bareSlug(other.slug) === bareSlug(area.slug)) ||
        (norm(area.title) !== "" && norm(other.title) === norm(area.title))
    );
    if (at === -1) {
      kept.push(area);
    } else if (!norm(kept[at].slug).startsWith("chauffeur-") && norm(area.slug).startsWith("chauffeur-")) {
      kept[at] = area;
    }
  }
  return kept;
}

/** The area's own image, or one of the site's photographs chosen by position so neighbours differ. */
export function areaListImage(area: AreaLike, index: number): string {
  return hasOwnImage(area.heroImage) ? area.heroImage : LIST_ROTATION[index % LIST_ROTATION.length];
}

// A small stable number from the slug, so an area always gets the same fallback photographs.
function slugNumber(area: AreaLike | null | undefined): number {
  const key = bareSlug(area?.slug) || norm(area?.title);
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return sum;
}

export function areaHeroImage(area: AreaLike | null | undefined): string {
  if (hasOwnImage(area?.heroImage)) return area.heroImage;
  return HERO_ROTATION[slugNumber(area) % HERO_ROTATION.length];
}

/**
 * Class for the element that holds a hero photograph. The forest-road picture has its car in the
 * middle of the frame, right where the headline sits, so on desktop it is shown wider than the hero,
 * which moves the car to the right of the copy. Every other photograph fills the hero as it is.
 */
export function heroFrameClass(src: string): string {
  return src === AREA_IMG.road ? "absolute inset-y-0 left-0 w-full lg:w-[128%]" : "absolute inset-0";
}

/** Never the same photograph as the hero above it. */
export function areaArticleImage(area: AreaLike | null | undefined): string {
  const hero = areaHeroImage(area);
  const pool = ARTICLE_ROTATION.filter((src) => src !== hero);
  return pool[slugNumber(area) % pool.length];
}

/** "01", "02", … */
export const twoDigits = (n: number) => String(n).padStart(2, "0");

/** The business phone number, formatted the same way as the navbar and footer. */
export function phoneFromSettings(settings: any): { label: string; href: string } {
  const raw = String(settings?.whatsapp_number || "441217140876");
  return {
    label: raw.startsWith("44") ? `+44 ${raw.substring(2, 6)} ${raw.substring(6)}` : raw,
    href: raw.startsWith("44") ? `tel:+${raw}` : `tel:${raw}`,
  };
}
