import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, ZoomIn, ZoomOut } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const polylineOutlineRef = useRef<L.Polyline | null>(null);

  // Map theme: "daylight" (Google Daylight Roads) or "voyager" (Clean Luxury Light)
  const [mapTheme, setMapTheme] = useState<"daylight" | "voyager">("daylight");

  // Tile sources
  const TILE_SOURCES = {
    daylight: {
      url: "https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
      options: {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google Maps",
      },
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      options: {
        maxZoom: 20,
        subdomains: "abcd",
        attribution: "© CARTO, © OpenStreetMap",
      },
    },
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!containerRef.current || leafletMapRef.current) return;

    // Center on UK (West Midlands / Birmingham / Solihull area)
    const map = L.map(containerRef.current, {
      center: [52.414, -1.815],
      zoom: 11,
      zoomControl: false, // Custom clean zoom controls
      attributionControl: false,
    });

    const activeTileConfig = TILE_SOURCES[mapTheme];
    const tiles = L.tileLayer(activeTileConfig.url, activeTileConfig.options).addTo(map);
    tileLayerRef.current = tiles;

    map.on("click", (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Switch Tile Layer when theme changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const activeTileConfig = TILE_SOURCES[mapTheme];
    const newTiles = L.tileLayer(activeTileConfig.url, activeTileConfig.options).addTo(leafletMapRef.current);
    tileLayerRef.current = newTiles;
  }, [mapTheme]);

  // Resize handling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Sync Coordinates, Markers, and Driving Route
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const lMap = leafletMapRef.current;

    // Clear previous markers & polylines
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.remove();
      dropoffMarkerRef.current = null;
    }
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
    if (polylineOutlineRef.current) {
      polylineOutlineRef.current.remove();
      polylineOutlineRef.current = null;
    }

    const bounds = L.latLngBounds([]);

    // Pickup Marker (Emerald Chauffeur Pin)
    if (pickupCoords) {
      const pickupIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));">
            <div style="width: 30px; height: 30px; border-radius: 9999px; background: linear-gradient(135deg, #10b981, #059669); border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 2px; background-color: #064e3b; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.4); text-transform: uppercase; white-space: nowrap; letter-spacing: 0.5px;">PICKUP</div>
          </div>
        `,
        iconSize: [30, 50],
        iconAnchor: [15, 25],
      });
      pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon }).addTo(lMap);
      bounds.extend([pickupCoords.lat, pickupCoords.lng]);
    }

    // Dropoff Marker (Rose / Red Destination Pin)
    if (dropoffCoords) {
      const dropoffIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));">
            <div style="width: 30px; height: 30px; border-radius: 9999px; background: linear-gradient(135deg, #f43f5e, #e11d48); border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 2px; background-color: #881337; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.4); text-transform: uppercase; white-space: nowrap; letter-spacing: 0.5px;">DROPOFF</div>
          </div>
        `,
        iconSize: [30, 50],
        iconAnchor: [15, 25],
      });
      dropoffMarkerRef.current = L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon }).addTo(lMap);
      bounds.extend([dropoffCoords.lat, dropoffCoords.lng]);
    }

    // Calculate Route if both coordinates exist
    if (pickupCoords && dropoffCoords) {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?overview=full&geometries=geojson`;

      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates;
            const latLngs = coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            const distanceMiles = route.distance / 1609.34;
            const timeMinutes = route.duration / 60;

            // Route background outline for contrast
            const outline = L.polyline(latLngs, {
              color: "#064e3b",
              weight: 7,
              opacity: 0.35,
            }).addTo(lMap);
            polylineOutlineRef.current = outline;

            // Main vibrant emerald route polyline
            const polyline = L.polyline(latLngs, {
              color: "#059669",
              weight: 4.5,
              opacity: 0.95,
            }).addTo(lMap);
            polylineRef.current = polyline;

            onRouteCalculated({
              distanceMiles,
              timeMinutes,
              routePoints: coordinates.map((c: [number, number]) => ({ lng: c[0], lat: c[1] })),
              instructions: [
                `Route via Roads (${distanceMiles.toFixed(1)} miles, ~${Math.round(timeMinutes)} mins)`,
              ],
            });
          }
        })
        .catch(() => {
          // Direct straight-line fallback if OSRM is offline
          const directLatLngs: [number, number][] = [
            [pickupCoords.lat, pickupCoords.lng],
            [dropoffCoords.lat, dropoffCoords.lng],
          ];
          const polyline = L.polyline(directLatLngs, {
            color: "#059669",
            weight: 4.5,
            opacity: 0.9,
          }).addTo(lMap);
          polylineRef.current = polyline;
        });

      lMap.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    } else if (pickupCoords || dropoffCoords) {
      const single = pickupCoords || dropoffCoords!;
      lMap.setView([single.lat, single.lng], 13);
    }
  }, [pickupCoords, dropoffCoords]);

  // Zoom helpers
  const handleZoomIn = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Interactive Map DOM */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[350px] z-0"
        style={{ minHeight: "350px", width: "100%", height: "100%" }}
      />

      {/* Top-Right Control Bar: Light Theme Toggle & Zoom */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {/* Light Theme Pill Switcher */}
        <div className="bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl p-1 shadow-sm flex items-center space-x-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMapTheme("daylight")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapTheme === "daylight"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Google Daylight Road View"
          >
            Google Light
          </button>
          <button
            type="button"
            onClick={() => setMapTheme("voyager")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              mapTheme === "voyager"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Ultra-Clean Voyager Light View"
          >
            Voyager
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur border border-slate-200/90 rounded-xl flex flex-col shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom In"
            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors border-b border-slate-100"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom Out"
            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
