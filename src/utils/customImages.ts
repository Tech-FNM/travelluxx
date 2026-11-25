// Images on the public site come from the dashboard settings (Site Content / Settings), with the
// bundled image as the fallback. Nothing is read from the visitor's browser storage, so every
// visitor (and the owner) sees the same picture.

/**
 * Turns a bundled image import (Next gives an object `{ src, width, height }`) or a plain URL
 * string into the URL string to put in `src`.
 */
export function imageSrc(image: any): string {
  if (image && typeof image === "object" && typeof image.src === "string") return image.src;
  return typeof image === "string" ? image : "";
}

/** The dashboard value when it is a non-empty string, otherwise the bundled fallback's URL. */
export function settingImage(value: unknown, fallback: any): string {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : imageSrc(fallback);
}
