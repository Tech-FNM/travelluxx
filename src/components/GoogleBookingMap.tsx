import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Clean light silver/emerald styling for Google Maps
const GOOGLE_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#444444" }],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [{ color: "#f2f4f7" }],
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{ visibility: "simplified" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [{ color: "#cbd5e1" }, { visibility: "on" }],
  },
];

export default function GoogleBookingMap({
  pickupCoords,
  dropoffCoords,
  pickupInput,
  dropoffInput,
  onMapClick,
  onRouteCalculated,
}: GoogleBookingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References for Google Map Mode
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googlePickupMarkerRef = useRef<google.maps.Marker | null>(null);
  const googleDropoffMarkerRef = useRef<google.maps.Marker | null>(null);
  const googleDirectionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const googlePolylineRef = useRef<google.maps.Polyline | null>(null);

  // References for Leaflet Mode (Clean Fallback)
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletPickupMarkerRef = useRef<L.Marker | null>(null);
  const leafletDropoffMarkerRef = useRef<L.Marker | null>(null);
  const leafletPolylineRef = useRef<L.Polyline | null>(null);
  const leafletDistanceMarkerRef = useRef<L.Marker | null>(null);

  const [useGoogleMaps, setUseGoogleMaps] = useState<boolean>(true);

  // 1. Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    // Check if Google Maps JS API is available
    if (typeof window !== "undefined" && window.google?.maps?.Map) {
      try {
        const map = new window.google.maps.Map(containerRef.current, {
          center: { lat: 52.414, lng: -1.815 },
          zoom: 11,
          disableDefaultUI: true, // No zoom buttons, no street view, no map type controls
          zoomControl: false, // Explicitly no zoom buttons
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: GOOGLE_MAP_STYLES, // Matching clean theme
        });

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });

        googleMapRef.current = map;
        setUseGoogleMaps(true);
        return;
      } catch (err) {
        console.warn("Failed initializing Google Maps, falling back to Leaflet:", err);
      }
    }

    // Fallback: Leaflet with Google Tiles & clean styling
    initLeaflet();

    function initLeaflet() {
      if (!containerRef.current || leafletMapRef.current) return;
      const map = L.map(containerRef.current, {
        zoomControl: false, // Zoom buttons removed!
        attributionControl: false,
      }).setView([52.414, -1.815], 11);

      L.tileLayer("https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}", {
        maxZoom: 19,
        attribution: "© Google Maps",
      }).addTo(map);

      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });

      leafletMapRef.current = map;
      setUseGoogleMaps(false);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Resize handling
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (googleMapRef.current && window.google?.maps?.event) {
        window.google.maps.event.trigger(googleMapRef.current, "resize");
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Sync Coordinates, Markers, and Road Routes
  useEffect(() => {
    // --- GOOGLE MAPS RENDERING ---
    if (useGoogleMaps && googleMapRef.current && window.google?.maps) {
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
      if (googleDirectionsRendererRef.current) {
        googleDirectionsRendererRef.current.setMap(null);
        googleDirectionsRendererRef.current = null;
      }
      if (googlePolylineRef.current) {
        googlePolylineRef.current.setMap(null);
        googlePolylineRef.current = null;
      }

      const bounds = new window.google.maps.LatLngBounds();

      // Custom Pickup Marker
      if (pickupCoords) {
        const pickupIcon = {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
              <path fill="#059669" stroke="#ffffff" stroke-width="2" d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 24 18 24s18-10.5 18-24c0-9.94-8.06-18-18-18z"/>
              <circle cx="18" cy="18" r="6" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 38),
          anchor: new window.google.maps.Point(16, 38),
        };

        const marker = new window.google.maps.Marker({
          position: pickupCoords,
          map: gMap,
          title: "Pickup",
          icon: pickupIcon,
        });
        googlePickupMarkerRef.current = marker;
        bounds.extend(pickupCoords);
      }

      // Custom Dropoff Marker
      if (dropoffCoords) {
        const dropoffIcon = {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 36 42">
              <path fill="#e11d48" stroke="#ffffff" stroke-width="2" d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 24 18 24s18-10.5 18-24c0-9.94-8.06-18-18-18z"/>
              <circle cx="18" cy="18" r="6" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 38),
          anchor: new window.google.maps.Point(16, 38),
        };

        const marker = new window.google.maps.Marker({
          position: dropoffCoords,
          map: gMap,
          title: "Dropoff",
          icon: dropoffIcon,
        });
        googleDropoffMarkerRef.current = marker;
        bounds.extend(dropoffCoords);
      }

      // If both coordinates present, calculate route
      if (pickupCoords && dropoffCoords) {
        // Try Google Directions Service
        if (window.google.maps.DirectionsService) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: pickupCoords,
              destination: dropoffCoords,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK && result) {
                const renderer = new window.google.maps.DirectionsRenderer({
                  map: gMap,
                  directions: result,
                  suppressMarkers: true, // Keep our custom emerald & rose markers
                  polylineOptions: {
                    strokeColor: "#059669",
                    strokeWeight: 5,
                    strokeOpacity: 0.9,
                  },
                });
                googleDirectionsRendererRef.current = renderer;

                const route = result.routes[0];
                const leg = route.legs[0];
                const distanceMiles = (leg.distance?.value || 0) / 1609.34;
                const timeMinutes = (leg.duration?.value || 0) / 60;

                const routePoints = (route.overview_path || []).map((pt) => ({
                  lat: pt.lat(),
                  lng: pt.lng(),
                }));

                onRouteCalculated({
                  distanceMiles,
                  timeMinutes,
                  routePoints,
                  instructions: [
                    `Route via Google Maps (${distanceMiles.toFixed(1)} miles, ~${Math.round(timeMinutes)} mins)`
                  ],
                });

                gMap.fitBounds(route.bounds, 50);
              } else {
                // If Google Directions denied/failed, calculate via OSRM roads
                calculateOsrmRouteForGoogle(pickupCoords, dropoffCoords, gMap);
              }
            }
          );
        } else {
          calculateOsrmRouteForGoogle(pickupCoords, dropoffCoords, gMap);
        }
      } else if (pickupCoords || dropoffCoords) {
        gMap.setCenter(pickupCoords || dropoffCoords!);
        gMap.setZoom(13);
      }
      return;
    }

    // --- LEAFLET RENDERING (FALLBACK) ---
    if (!useGoogleMaps && leafletMapRef.current) {
      const lMap = leafletMapRef.current;

      if (leafletPickupMarkerRef.current) {
        leafletPickupMarkerRef.current.remove();
        leafletPickupMarkerRef.current = null;
      }
      if (leafletDropoffMarkerRef.current) {
        leafletDropoffMarkerRef.current.remove();
        leafletDropoffMarkerRef.current = null;
      }
      if (leafletPolylineRef.current) {
        leafletPolylineRef.current.remove();
        leafletPolylineRef.current = null;
      }
      if (leafletDistanceMarkerRef.current) {
        leafletDistanceMarkerRef.current.remove();
        leafletDistanceMarkerRef.current = null;
      }

      const bounds = L.latLngBounds([]);

      if (pickupCoords) {
        const pickupIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #059669; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #ffffff;"></div>
              </div>
              <div style="margin-top: 2px; background-color: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-transform: uppercase; white-space: nowrap;">PICKUP</div>
            </div>
          `,
          iconSize: [28, 48],
          iconAnchor: [14, 24],
        });
        leafletPickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon }).addTo(lMap);
        bounds.extend([pickupCoords.lat, pickupCoords.lng]);
      }

      if (dropoffCoords) {
        const dropoffIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #e11d48; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; border-radius: 9999px; background-color: #ffffff;"></div>
              </div>
              <div style="margin-top: 2px; background-color: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-transform: uppercase; white-space: nowrap;">DROPOFF</div>
            </div>
          `,
          iconSize: [28, 48],
          iconAnchor: [14, 24],
        });
        leafletDropoffMarkerRef.current = L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: dropoffIcon }).addTo(lMap);
        bounds.extend([dropoffCoords.lat, dropoffCoords.lng]);
      }

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

              const polyline = L.polyline(latLngs, {
                color: "#059669",
                weight: 5,
                opacity: 0.85,
              }).addTo(lMap);
              leafletPolylineRef.current = polyline;

              onRouteCalculated({
                distanceMiles,
                timeMinutes,
                routePoints: coordinates.map((c: [number, number]) => ({ lng: c[0], lat: c[1] })),
                instructions: [`Route via Roads (${distanceMiles.toFixed(1)} miles, ~${Math.round(timeMinutes)} mins)`],
              });
            }
          })
          .catch(() => {
            // Direct line fallback
            const polyline = L.polyline([[pickupCoords.lat, pickupCoords.lng], [dropoffCoords.lat, dropoffCoords.lng]], {
              color: "#059669",
              weight: 5,
              opacity: 0.85,
            }).addTo(lMap);
            leafletPolylineRef.current = polyline;
          });

        lMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else if (pickupCoords || dropoffCoords) {
        lMap.setView([pickupCoords ? pickupCoords.lat : dropoffCoords!.lat, pickupCoords ? pickupCoords.lng : dropoffCoords!.lng], 13);
      }
    }

    function calculateOsrmRouteForGoogle(
      pCoords: { lat: number; lng: number },
      dCoords: { lat: number; lng: number },
      gMap: google.maps.Map
    ) {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pCoords.lng},${pCoords.lat};${dCoords.lng},${dCoords.lat}?overview=full&geometries=geojson`;
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

            const polyline = new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: "#059669",
              strokeOpacity: 0.9,
              strokeWeight: 5,
              map: gMap,
            });
            googlePolylineRef.current = polyline;

            const b = new window.google.maps.LatLngBounds();
            path.forEach((pt: any) => b.extend(pt));
            gMap.fitBounds(b, 50);

            onRouteCalculated({
              distanceMiles,
              timeMinutes,
              routePoints: path,
              instructions: [
                `Route via Roads (${distanceMiles.toFixed(1)} miles, ~${Math.round(timeMinutes)} mins)`
              ],
            });
          }
        })
        .catch(() => {
          const directPath = [pCoords, dCoords];
          const polyline = new window.google.maps.Polyline({
            path: directPath,
            strokeColor: "#059669",
            strokeWeight: 5,
            map: gMap,
          });
          googlePolylineRef.current = polyline;
        });
    }
  }, [pickupCoords, dropoffCoords, useGoogleMaps]);

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
      <div
        ref={containerRef}
        className="w-full h-full min-h-[350px] z-0"
        style={{ minHeight: "350px", width: "100%", height: "100%" }}
      />
    </div>
  );
}
