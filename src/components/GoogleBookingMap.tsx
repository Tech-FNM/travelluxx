import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ZoomIn, ZoomOut } from "lucide-react";

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

// Key luxury travel & business hubs with interactive click popups
const POPULAR_UK_HUBS = [
  { name: "Birmingham Airport (BHX)", type: "International Airport", lat: 52.4539, lng: -1.7481 },
  { name: "The NEC Birmingham", type: "Exhibition & Business Centre", lat: 52.4526, lng: -1.7169 },
  { name: "Solihull Town Centre", type: "Luxury Shopping & Chauffeur Hub", lat: 52.4132, lng: -1.7774 },
  { name: "Grand Central / New Street", type: "Central Business District", lat: 52.4777, lng: -1.8986 },
  { name: "London Heathrow (LHR)", type: "VIP Airport Terminal", lat: 51.4700, lng: -0.4543 },
];

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
  const routeOutlineRef = useRef<L.Polyline | null>(null);
  const hubMarkersRef = useRef<L.Marker[]>([]);

  // 1. Initialize Original Google Roadmap Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on West Midlands / Solihull / Birmingham area
    const map = L.map(mapContainerRef.current, {
      center: [52.414, -1.815],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    // Direct Google Maps Roadmap tile engine (Authentic Google map without watermarks or billing blocks)
    L.tileLayer("https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      attribution: "© Google Maps",
    }).addTo(map);

    // Add interactive Business & Travel Hub Pins
    const createdHubMarkers: L.Marker[] = [];
    POPULAR_UK_HUBS.forEach((hub) => {
      const hubIcon = L.divIcon({
        className: "custom-hub-marker",
        html: `
          <div style="cursor: pointer; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 3px 5px rgba(0,0,0,0.25)); transition: transform 0.2s;">
            <div style="width: 26px; height: 26px; border-radius: 9999px; background: #ffffff; border: 2.5px solid #0f172a; display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background: #059669;"></div>
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: hubIcon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 180px; font-family: 'Inter', system-ui, sans-serif; padding: 3px 1px;">
          <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">${hub.type}</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 3px; line-height: 1.3;">${hub.name}</div>
          <div style="margin-top: 8px; display: flex; gap: 6px;">
            <button onclick="window.__setMapPickup && window.__setMapPickup(${hub.lat}, ${hub.lng}, '${hub.name.replace(/'/g, "\\'")}')" style="background: #059669; color: #ffffff; border: none; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Set Location</button>
          </div>
        </div>
      `, {
        closeButton: true,
        className: "luxury-custom-popup",
      });

      createdHubMarkers.push(marker);
    });
    hubMarkersRef.current = createdHubMarkers;

    // Window helper for popup buttons
    (window as any).__setMapPickup = (lat: number, lng: number) => {
      onMapClick(lat, lng);
    };

    // On Map Click: Reverse geocode to get business/place name and show popup + set coordinates
    map.on("click", async (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&zoom=18&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          const placeName = data.display_name ? data.display_name.split(",").slice(0, 2).join(",") : "Selected Location";
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div style="min-width: 160px; font-family: 'Inter', system-ui, sans-serif; padding: 2px;">
                <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Pinned Location</div>
                <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${placeName}</div>
              </div>
            `)
            .openOn(map);
        }
      } catch (err) {
        // ignore
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Container Resizing
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Sync Coordinates, Interactive Pins & Road Routing
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear previous markers & lines
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
    if (routeOutlineRef.current) {
      routeOutlineRef.current.remove();
      routeOutlineRef.current = null;
    }

    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    // Pickup Marker with Interactive Business/Address Popup
    if (pickupCoords) {
      const pickupIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <div style="width: 32px; height: 32px; border-radius: 9999px; background: linear-gradient(135deg, #10b981, #059669); border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center;">
              <div style="width: 9px; height: 9px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 2px; background-color: #064e3b; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.4); text-transform: uppercase; white-space: nowrap; letter-spacing: 0.5px;">PICKUP</div>
          </div>
        `,
        iconSize: [32, 52],
        iconAnchor: [16, 26],
      });

      const marker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 170px; font-family: 'Inter', system-ui, sans-serif; padding: 3px 2px;">
          <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.3;">${pickupInput || "Selected Pickup Location"}</div>
        </div>
      `, { className: "luxury-custom-popup" });

      pickupMarkerRef.current = marker;
      bounds.extend([pickupCoords.lat, pickupCoords.lng]);
      hasBounds = true;
    }

    // Drop-off Marker with Interactive Business/Address Popup
    if (dropoffCoords) {
      const dropoffIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <div style="width: 32px; height: 32px; border-radius: 9999px; background: linear-gradient(135deg, #f43f5e, #e11d48); border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center;">
              <div style="width: 9px; height: 9px; border-radius: 9999px; background-color: #ffffff;"></div>
            </div>
            <div style="margin-top: 2px; background-color: #881337; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.4); text-transform: uppercase; white-space: nowrap; letter-spacing: 0.5px;">DROPOFF</div>
          </div>
        `,
        iconSize: [32, 52],
        iconAnchor: [16, 26],
      });

      const marker = L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 170px; font-family: 'Inter', system-ui, sans-serif; padding: 3px 2px;">
          <div style="font-size: 10px; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 0.5px;">Destination</div>
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.3;">${dropoffInput || "Selected Destination"}</div>
        </div>
      `, { className: "luxury-custom-popup" });

      dropoffMarkerRef.current = marker;
      bounds.extend([dropoffCoords.lat, dropoffCoords.lng]);
      hasBounds = true;
    }

    // Driving Road Route Calculation
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

            // Route Outline for contrast
            const outline = L.polyline(latLngs, {
              color: "#064e3b",
              weight: 7.5,
              opacity: 0.35,
            }).addTo(map);
            routeOutlineRef.current = outline;

            // Vibrant Emerald Road Polyline
            const polyline = L.polyline(latLngs, {
              color: "#059669",
              weight: 5,
              opacity: 0.95,
            }).addTo(map);
            routePolylineRef.current = polyline;

            // Interactive Centered Distance Badge
            const midIndex = Math.floor(latLngs.length / 2);
            const midPoint = latLngs[midIndex] || latLngs[0];
            const badgeIcon = L.divIcon({
              className: "custom-distance-badge",
              html: `
                <div style="background-color: #ffffff; color: #047857; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; border: 2px solid #059669; box-shadow: 0 3px 8px rgba(0,0,0,0.2); font-family: 'Inter', sans-serif; white-space: nowrap; cursor: pointer;">
                  ${distanceMiles.toFixed(1)} mi (${Math.round(timeMinutes)} mins)
                </div>
              `,
              iconSize: [90, 26],
              iconAnchor: [45, 13],
            });
            const dMarker = L.marker(midPoint, { icon: badgeIcon }).addTo(map);
            dMarker.bindPopup(`
              <div style="font-family: 'Inter', sans-serif; padding: 2px; text-align: center;">
                <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">Direct Driving Route</div>
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px;">${distanceMiles.toFixed(1)} miles • ~${Math.round(timeMinutes)} minutes</div>
              </div>
            `);
            distanceMarkerRef.current = dMarker;

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
          // Direct fallback
          const directLatLngs: [number, number][] = [
            [pickupCoords.lat, pickupCoords.lng],
            [dropoffCoords.lat, dropoffCoords.lng],
          ];
          const polyline = L.polyline(directLatLngs, {
            color: "#059669",
            weight: 5,
            opacity: 0.9,
          }).addTo(map);
          routePolylineRef.current = polyline;
        });

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (hasBounds) {
      const single = pickupCoords || dropoffCoords!;
      map.setView([single.lat, single.lng], 13);
    }
  }, [pickupCoords, dropoffCoords]);

  // Zoom helpers
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[350px] z-0"
        style={{ minHeight: "350px", width: "100%", height: "100%" }}
      />

      {/* Top-Right Control Bar: Clean Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
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
