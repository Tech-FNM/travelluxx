import React, { useEffect, useRef } from "react";

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

declare global {
  interface Window {
    google?: any;
  }
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
  const mapRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);
  const distanceOverlayRef = useRef<any>(null);

  // Initialize Native Google Map
  useEffect(() => {
    let checkInterval: any = null;

    const initMap = () => {
      if (!mapContainerRef.current) return;
      if (mapRef.current) return;

      if (!window.google || !window.google.maps) {
        return; // Will retry via interval
      }

      try {
        const defaultCenter = { lat: 52.414, lng: -1.815 }; // Shirley / Solihull
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ lightness: 20 }],
            },
          ],
        });

        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#059669", // Premium Travelluxx Emerald Green
            strokeWeight: 6,
            strokeOpacity: 0.9,
          },
        });

        map.addListener("click", (e: any) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });

        mapRef.current = map;
        directionsRendererRef.current = directionsRenderer;
      } catch (err) {
        console.error("Google Maps initialization failed:", err);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          initMap();
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // Update Markers & Directions
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;

    // Clear previous custom markers
    if (pickupMarkerRef.current) {
      pickupMarkerRef.current.setMap(null);
      pickupMarkerRef.current = null;
    }
    if (dropoffMarkerRef.current) {
      dropoffMarkerRef.current.setMap(null);
      dropoffMarkerRef.current = null;
    }
    if (distanceOverlayRef.current) {
      distanceOverlayRef.current.setMap(null);
      distanceOverlayRef.current = null;
    }

    const bounds = new window.google.maps.LatLngBounds();
    let hasCoords = false;

    // Helper to create branded HTML marker elements
    const createMarkerIcon = (isPickup: boolean) => {
      const color = isPickup ? "#059669" : "#e11d48";
      const label = isPickup ? "PICKUP" : "DROPOFF";
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="52" viewBox="0 0 36 52">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.35"/>
            </filter>
          </defs>
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 34 18 34s18-20.5 18-34c0-9.94-8.06-18-18-18z" fill="${color}" filter="url(#shadow)"/>
          <circle cx="18" cy="18" r="7" fill="#ffffff"/>
        </svg>
      `;
      return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new window.google.maps.Size(36, 52),
        anchor: new window.google.maps.Point(18, 52),
      };
    };

    if (pickupCoords) {
      const pMarker = new window.google.maps.Marker({
        position: pickupCoords,
        map: map,
        title: "Pickup: " + (pickupInput || "Selected location"),
        icon: createMarkerIcon(true),
        animation: window.google.maps.Animation.DROP,
      });
      pickupMarkerRef.current = pMarker;
      bounds.extend(pickupCoords);
      hasCoords = true;
    }

    if (dropoffCoords) {
      const dMarker = new window.google.maps.Marker({
        position: dropoffCoords,
        map: map,
        title: "Dropoff: " + (dropoffInput || "Selected destination"),
        icon: createMarkerIcon(false),
        animation: window.google.maps.Animation.DROP,
      });
      dropoffMarkerRef.current = dMarker;
      bounds.extend(dropoffCoords);
      hasCoords = true;
    }

    // Both points present: calculate official Google Maps Directions
    if (pickupCoords && dropoffCoords) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickupCoords,
          destination: dropoffCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
          },
        },
        (result: any, status: any) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            if (directionsRendererRef.current) {
              directionsRendererRef.current.setDirections(result);
            }

            const route = result.routes[0];
            if (route && route.legs && route.legs[0]) {
              const leg = route.legs[0];
              const distanceMeters = leg.distance.value;
              const durationSeconds = leg.duration_in_traffic ? leg.duration_in_traffic.value : leg.duration.value;

              const distanceMiles = distanceMeters / 1609.34;
              const timeMinutes = durationSeconds / 60;

              // Extract route polyline points
              const path = route.overview_path || [];
              const routePoints = path.map((p: any) => ({
                lat: p.lat(),
                lng: p.lng(),
              }));

              const instructions = leg.steps.map((step: any) =>
                step.instructions ? step.instructions.replace(/<[^>]*>/g, "") : ""
              ).filter(Boolean);

              // Center floating badge along middle of path
              if (path.length > 0) {
                const midPoint = path[Math.floor(path.length / 2)];
                const badgeOverlay = new window.google.maps.Marker({
                  position: midPoint,
                  map: map,
                  icon: {
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="34" viewBox="0 0 90 34">
                        <rect x="1" y="1" width="88" height="32" rx="16" fill="#ffffff" stroke="#059669" stroke-width="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>
                        <text x="45" y="21" font-family="-apple-system, sans-serif" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">
                          ${distanceMiles.toFixed(1)} mi
                        </text>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(90, 34),
                    anchor: new window.google.maps.Point(45, 17),
                  },
                  clickable: false,
                });
                distanceOverlayRef.current = badgeOverlay;
              }

              onRouteCalculated({
                distanceMiles,
                timeMinutes,
                routePoints,
                instructions: instructions.length > 0 ? instructions : [
                  `Google Maps route: ${leg.distance.text}, approx ${leg.duration.text}`,
                ],
              });
            }
          } else {
            console.warn("Google Directions error, using straight path fallback:", status);
            map.fitBounds(bounds);
          }
        }
      );
    } else if (hasCoords) {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.set("directions", null);
      }
      map.fitBounds(bounds);
      const listener = window.google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 14) map.setZoom(14);
        window.google.maps.event.removeListener(listener);
      });
    } else {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.set("directions", null);
      }
    }
  }, [pickupCoords, dropoffCoords]);

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100">
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-200 z-0"
        style={{ minHeight: "350px", width: "100%", height: "100%" }}
      />
    </div>
  );
}
