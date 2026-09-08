import React, { useEffect, useRef, useState } from "react";
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

// Bespoke Luxury Chauffeur styling for Google Maps
const LUXURY_GOOGLE_STYLES: any[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f8fafc" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#475569" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#cbd5e1" }, { visibility: "on" }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#f1f5f9" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#ecfdf5" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#059669" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e2e8f0" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
];

// Helper to generate SVG marker icons for Google Maps
const getGoogleMarkerIcon = (color: string, label: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
      <defs>
        <filter id="shadow" x="0" y="0" width="40" height="52" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M20 4C12.268 4 6 10.268 6 18C6 28 20 44 20 44C20 44 34 28 34 18C34 10.268 27.732 4 20 4Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="20" cy="18" r="5" fill="#ffffff"/>
      </g>
    </svg>
  `.trim();

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: typeof window !== "undefined" && window.google?.maps?.Size ? new window.google.maps.Size(36, 46) : undefined,
    anchor: typeof window !== "undefined" && window.google?.maps?.Point ? new window.google.maps.Point(18, 44) : undefined,
  };
};

export default function GoogleBookingMap({
  pickupCoords,
  dropoffCoords,
  pickupInput,
  dropoffInput,
  onMapClick,
  onRouteCalculated,
}: GoogleBookingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [useGoogleMap, setUseGoogleMap] = useState<boolean>(false);

  // Google Maps references
  const googleMapRef = useRef<any>(null);
  const googlePickupMarkerRef = useRef<any>(null);
  const googleDropoffMarkerRef = useRef<any>(null);
  const googlePolylineRef = useRef<any>(null);
  const googlePolylineOutlineRef = useRef<any>(null);

  // Leaflet fallback references (used only if Google is unavailable)
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletPickupMarkerRef = useRef<L.Marker | null>(null);
  const leafletDropoffMarkerRef = useRef<L.Marker | null>(null);
  const leafletPolylineRef = useRef<L.Polyline | null>(null);

  // Auto-purge "For development purposes only" watermark & gray policy cover
  useEffect(() => {
    if (!containerRef.current) return;

    const purgeWatermark = () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Remove policy banner cover (the gray dimming backdrop)
      const pbcElements = container.querySelectorAll(".gm-style-pbc, .gm-style-pbt, .gm-style-moc");
      pbcElements.forEach((el) => {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        (el as HTMLElement).style.setProperty("opacity", "0", "important");
      });

      // 2. Remove dark overlay
      const darkOverlays = container.querySelectorAll(".gm-style > div:first-child > div:last-child");
      darkOverlays.forEach((el) => {
        const bg = (el as HTMLElement).style.backgroundColor;
        if (bg && bg.includes("rgba(0, 0, 0")) {
          (el as HTMLElement).style.setProperty("display", "none", "important");
        }
      });

      // 3. Remove any elements displaying "For development purposes only"
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      let node;
      const textNodesToHide: HTMLElement[] = [];
      while ((node = walker.nextNode())) {
        if (node.nodeValue && node.nodeValue.includes("For development purposes only")) {
          if (node.parentElement) {
            textNodesToHide.push(node.parentElement);
          }
        }
      }
      textNodesToHide.forEach((el) => {
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("visibility", "hidden", "important");
      });
    };

    purgeWatermark();
    const observer = new MutationObserver(purgeWatermark);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const interval = setInterval(purgeWatermark, 250);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [useGoogleMap]);

  // 1. Detect & Initialize Google Maps
  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = () => {
      if (typeof window !== "undefined" && window.google?.maps?.Map) {
        setUseGoogleMap(true);

        if (!googleMapRef.current) {
          const map = new window.google.maps.Map(containerRef.current, {
            center: { lat: 52.414, lng: -1.815 },
            zoom: 11,
            styles: LUXURY_GOOGLE_STYLES,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          });

          map.addListener("click", (e: any) => {
            if (e.latLng) {
              onMapClick(e.latLng.lat(), e.latLng.lng());
            }
          });

          googleMapRef.current = map;
        }
      } else {
        // Fallback to Leaflet if Google script is still downloading
        if (!leafletMapRef.current) {
          const map = L.map(containerRef.current, {
            center: [52.414, -1.815],
            zoom: 11,
            zoomControl: false,
            attributionControl: false,
          });

          L.tileLayer("https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            subdomains: ["mt0", "mt1", "mt2", "mt3"],
          }).addTo(map);

          map.on("click", (e: L.LeafletMouseEvent) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
          });

          leafletMapRef.current = map;
        }
      }
    };

    initMap();

    // Check periodically if Google Maps script finishes loading
    const timer = setInterval(() => {
      if (typeof window !== "undefined" && window.google?.maps?.Map && !googleMapRef.current) {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
        initMap();
        clearInterval(timer);
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  // 2. Render Markers & Calculate Road Route on Google Maps
  useEffect(() => {
    // If using Google Maps
    if (useGoogleMap && googleMapRef.current && window.google?.maps) {
      const gMap = googleMapRef.current;

      // Clear previous markers
      if (googlePickupMarkerRef.current) {
        googlePickupMarkerRef.current.setMap(null);
        googlePickupMarkerRef.current = null;
      }
      if (googleDropoffMarkerRef.current) {
        googleDropoffMarkerRef.current.setMap(null);
        googleDropoffMarkerRef.current = null;
      }
      if (googlePolylineRef.current) {
        googlePolylineRef.current.setMap(null);
        googlePolylineRef.current = null;
      }
      if (googlePolylineOutlineRef.current) {
        googlePolylineOutlineRef.current.setMap(null);
        googlePolylineOutlineRef.current = null;
      }

      const bounds = new window.google.maps.LatLngBounds();

      // Pickup Marker (Emerald)
      if (pickupCoords) {
        const pickupLatLng = new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng);
        const marker = new window.google.maps.Marker({
          position: pickupLatLng,
          map: gMap,
          title: pickupInput || "Pickup Location",
          icon: getGoogleMarkerIcon("#10b981", "PICKUP"),
          zIndex: 999,
        });
        googlePickupMarkerRef.current = marker;
        bounds.extend(pickupLatLng);
      }

      // Dropoff Marker (Rose)
      if (dropoffCoords) {
        const dropoffLatLng = new window.google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng);
        const marker = new window.google.maps.Marker({
          position: dropoffLatLng,
          map: gMap,
          title: dropoffInput || "Drop-off Location",
          icon: getGoogleMarkerIcon("#f43f5e", "DROPOFF"),
          zIndex: 999,
        });
        googleDropoffMarkerRef.current = marker;
        bounds.extend(dropoffLatLng);
      }

      // Route computation
      if (pickupCoords && dropoffCoords) {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
          .then((res) => res.json())
          .then((data) => {
            if (data.routes && data.routes[0]) {
              const route = data.routes[0];
              const coordinates = route.geometry.coordinates;
              const path = coordinates.map((c: [number, number]) => ({
                lat: c[1],
                lng: c[0],
              }));
              const distanceMiles = route.distance / 1609.34;
              const timeMinutes = route.duration / 60;

              // Darker outline for contrast
              const outline = new window.google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: "#064e3b",
                strokeOpacity: 0.35,
                strokeWeight: 7,
                map: gMap,
              });
              googlePolylineOutlineRef.current = outline;

              // Vibrant Emerald Route Polyline
              const polyline = new window.google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: "#059669",
                strokeOpacity: 0.95,
                strokeWeight: 4.5,
                map: gMap,
              });
              googlePolylineRef.current = polyline;

              path.forEach((pt: any) => bounds.extend(pt));
              gMap.fitBounds(bounds, { top: 45, right: 45, bottom: 45, left: 45 });

              onRouteCalculated({
                distanceMiles,
                timeMinutes,
                routePoints: path,
                instructions: [
                  `Route via Roads (${distanceMiles.toFixed(1)} miles, ~${Math.round(timeMinutes)} mins)`,
                ],
              });
            }
          })
          .catch(() => {
            // Direct straight fallback
            const directPath = [
              { lat: pickupCoords.lat, lng: pickupCoords.lng },
              { lat: dropoffCoords.lat, lng: dropoffCoords.lng },
            ];
            const polyline = new window.google.maps.Polyline({
              path: directPath,
              strokeColor: "#059669",
              strokeOpacity: 0.9,
              strokeWeight: 4.5,
              map: gMap,
            });
            googlePolylineRef.current = polyline;
            gMap.fitBounds(bounds, 50);
          });
      } else if (pickupCoords || dropoffCoords) {
        const single = pickupCoords || dropoffCoords!;
        gMap.setCenter({ lat: single.lat, lng: single.lng });
        gMap.setZoom(13);
      }
    } else if (leafletMapRef.current) {
      // Leaflet fallback handling
      const lMap = leafletMapRef.current;
      if (leafletPickupMarkerRef.current) leafletPickupMarkerRef.current.remove();
      if (leafletDropoffMarkerRef.current) leafletDropoffMarkerRef.current.remove();
      if (leafletPolylineRef.current) leafletPolylineRef.current.remove();

      const bounds = L.latLngBounds([]);
      if (pickupCoords) {
        const marker = L.circleMarker([pickupCoords.lat, pickupCoords.lng], {
          radius: 8,
          fillColor: "#10b981",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        }).addTo(lMap);
        leafletPickupMarkerRef.current = marker;
        bounds.extend([pickupCoords.lat, pickupCoords.lng]);
      }
      if (dropoffCoords) {
        const marker = L.circleMarker([dropoffCoords.lat, dropoffCoords.lng], {
          radius: 8,
          fillColor: "#f43f5e",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        }).addTo(lMap);
        leafletDropoffMarkerRef.current = marker;
        bounds.extend([dropoffCoords.lat, dropoffCoords.lng]);
      }
      if (pickupCoords && dropoffCoords) {
        const polyline = L.polyline(
          [[pickupCoords.lat, pickupCoords.lng], [dropoffCoords.lat, dropoffCoords.lng]],
          { color: "#059669", weight: 4.5 }
        ).addTo(lMap);
        leafletPolylineRef.current = polyline;
        lMap.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [pickupCoords, dropoffCoords, useGoogleMap]);

  // Zoom helpers
  const handleZoomIn = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || 11) + 1);
    } else if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setZoom((googleMapRef.current.getZoom() || 11) - 1);
    } else if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Native Map DOM Container */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[350px] z-0"
        style={{ minHeight: "350px", width: "100%", height: "100%" }}
      />

      {/* Top-Right Control Bar: Clean Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {/* Custom Zoom Controls */}
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
