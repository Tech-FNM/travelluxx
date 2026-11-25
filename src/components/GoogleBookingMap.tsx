import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useContent } from "../content/useContent";

// Labels are injected into Leaflet's HTML strings, so escape them.
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);

const fill = (pattern: string, vars: Record<string, string | number>) =>
  pattern.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

const toNum = (v: string, fallback: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

interface GoogleBookingMapProps {
  pickupCoords: { lat: number; lng: number } | null;
  dropoffCoords: { lat: number; lng: number } | null;
  pickupInput: string;
  dropoffInput: string;
  onMapClick: (lat: number, lng: number) => void;
  onRouteCalculated: (result: {
    distanceMiles: number;
    timeMinutes: number;
    routePoints: { lat: number; lng: number }[];
    instructions: string[];
  }) => void;
}

export default function GoogleBookingMap({
  pickupCoords,
  dropoffCoords,
  pickupInput,
  dropoffInput,
  onMapClick,
  onRouteCalculated,
}: GoogleBookingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const distanceMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const c = useContent();
  // Latest texts, read inside the map effects without adding them as dependencies.
  const textRef = useRef(c);
  textRef.current = c;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(
      [
        toNum(textRef.current.t("booking_map_center_lat"), 52.414),
        toNum(textRef.current.t("booking_map_center_lng"), -1.815),
      ],
      10
    );

    // Re-add zoom control at bottom-right corner
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Google Roadmap vector tile layer in English (&hl=en)
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}", {
      maxZoom: 19,
      attribution: "© Google Maps",
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Automatically recalculate map dimensions when container resizes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Update Markers and Route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers & route
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }
    if (distanceMarkerRef.current) {
      distanceMarkerRef.current.remove();
      distanceMarkerRef.current = null;
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    const t = textRef.current.t;
    const mi = esc(t("booking_map_unit_miles"));
    const km = esc(t("booking_map_unit_km"));
    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    if (pickupCoords) {
      const pickupIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #184f37; border: 3px solid #ffffff; box-shadow: 0 0 0 1px rgba(28,25,23,0.25); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 3px; background-color: #ffffff; color: #1c1917; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; line-height: 1.4; padding: 1px 6px; border-radius: 2px; border: 1px solid #d6d3d1; text-transform: uppercase; white-space: nowrap;">${esc(t("booking_map_pin_pickup"))}</div>
          </div>
        `,
        iconSize: [28, 48],
        iconAnchor: [14, 24],
      });

      const marker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon }).addTo(map);
      pickupMarkerRef.current = marker;
      bounds.extend([pickupCoords.lat, pickupCoords.lng]);
      hasBounds = true;
    }

    if (dropoffCoords) {
      const dropoffIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 28px; height: 28px; border-radius: 2px; background-color: #1c1917; border: 3px solid #ffffff; box-shadow: 0 0 0 1px rgba(28,25,23,0.25); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 1px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 3px; background-color: #ffffff; color: #1c1917; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; line-height: 1.4; padding: 1px 6px; border-radius: 2px; border: 1px solid #d6d3d1; text-transform: uppercase; white-space: nowrap;">${esc(t("booking_map_pin_dropoff"))}</div>
          </div>
        `,
        iconSize: [28, 48],
        iconAnchor: [14, 24],
      });

      const marker = L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon }).addTo(map);
      dropoffMarkerRef.current = marker;
      bounds.extend([dropoffCoords.lat, dropoffCoords.lng]);
      hasBounds = true;
    }

    if (pickupCoords && dropoffCoords) {
      // Fetch OSRM Public Routing API
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates; // [lng, lat]
            const latLngs = coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            
            const distanceMeters = route.distance; // meters
            const durationSeconds = route.duration; // seconds

            const distanceMiles = distanceMeters / 1609.344;
            const distanceKm = distanceMeters / 1000;
            const timeMinutes = durationSeconds / 60;

            const routePoints = coordinates.map((c: [number, number]) => ({
              lng: c[0],
              lat: c[1],
            }));

            const polyline = L.polyline(latLngs, {
              color: "#184f37",
              weight: 5,
              opacity: 0.85,
            }).addTo(map);

            routePolylineRef.current = polyline;

            // Centered distance badge along route path showing miles & km
            const midIndex = Math.floor(latLngs.length / 2);
            const midPoint = latLngs[midIndex] || latLngs[0];
            const badgeIcon = L.divIcon({
              className: "custom-distance-badge",
              html: `
                <div style="display: flex; justify-content: center;">
                  <div style="background-color: #ffffff; color: #1c1917; font-size: 11px; font-weight: 600; line-height: 1.4; padding: 3px 8px; border-radius: 2px; border: 1px solid #184f37; font-family: inherit; font-variant-numeric: tabular-nums; white-space: nowrap;">
                    ${distanceMiles.toFixed(1)} ${mi} (${distanceKm.toFixed(1)} ${km})
                  </div>
                </div>
              `,
              iconSize: [110, 26],
              iconAnchor: [55, 13],
            });
            distanceMarkerRef.current = L.marker(midPoint, { icon: badgeIcon, interactive: false }).addTo(map);

            onRouteCalculated({
              distanceMiles,
              timeMinutes,
              routePoints,
              instructions: [
                fill(t("booking_map_route_summary"), {
                  miles: distanceMiles.toFixed(1),
                  km: distanceKm.toFixed(1),
                  minutes: Math.round(timeMinutes),
                }),
              ],
            });
          }
        })
        .catch((err) => {
          console.warn("OSRM Routing fetch error, using fallback Haversine:", err);
          // Fallback Haversine
          const R = 3958.8; // Radius of Earth in miles
          const dLat = ((dropoffCoords.lat - pickupCoords.lat) * Math.PI) / 180;
          const dLon = ((dropoffCoords.lng - pickupCoords.lng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((pickupCoords.lat * Math.PI) / 180) *
              Math.cos((dropoffCoords.lat * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceMiles = R * c * 1.3; // 1.3 road factor
          const timeMinutes = (distanceMiles / 35) * 60; // assume 35mph avg

          const latLngs = [
            [pickupCoords.lat, pickupCoords.lng] as [number, number],
            [dropoffCoords.lat, dropoffCoords.lng] as [number, number],
          ];

          const polyline = L.polyline(latLngs, {
            color: "#184f37",
            weight: 5,
            opacity: 0.85,
          }).addTo(map);

          routePolylineRef.current = polyline;

          const midLat = (pickupCoords.lat + dropoffCoords.lat) / 2;
          const midLng = (pickupCoords.lng + dropoffCoords.lng) / 2;
          const badgeIcon = L.divIcon({
            className: "custom-distance-badge",
            html: `
              <div style="display: flex; justify-content: center;">
                <div style="background-color: #ffffff; color: #1c1917; font-size: 11px; font-weight: 600; line-height: 1.4; padding: 3px 8px; border-radius: 2px; border: 1px solid #184f37; font-family: inherit; font-variant-numeric: tabular-nums; white-space: nowrap;">
                  ${distanceMiles.toFixed(1)} ${mi}
                </div>
              </div>
            `,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });
          distanceMarkerRef.current = L.marker([midLat, midLng], { icon: badgeIcon, interactive: false }).addTo(map);

          onRouteCalculated({
            distanceMiles,
            timeMinutes,
            routePoints: [
              { lat: pickupCoords.lat, lng: pickupCoords.lng },
              { lat: dropoffCoords.lat, lng: dropoffCoords.lng }
            ],
            instructions: [fill(t("booking_map_route_summary_direct"), { miles: distanceMiles.toFixed(1) })],
          });
        });

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (hasBounds) {
      map.setView([pickupCoords ? pickupCoords.lat : dropoffCoords!.lat, pickupCoords ? pickupCoords.lng : dropoffCoords!.lng], 13);
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="relative w-full h-full min-h-[250px]" style={{ filter: "none", backgroundColor: "#e5e3df" }}>
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[250px] overflow-hidden z-0 [&_.leaflet-bar]:rounded-sm! [&_.leaflet-bar]:shadow-none!"
        style={{ filter: "none", backgroundColor: "#e5e3df" }}
      />
    </div>
  );
}
