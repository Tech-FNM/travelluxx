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

// Custom Light Styling for Google Maps that keeps Google Business POIs crisp & visible
const GOOGLE_MAP_STYLES: any[] = [
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dcfce7" }, { visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#bfdbfe" }],
  },
];

// Helper to generate SVG marker icons for Google Maps
const getGoogleMarkerIcon = (color: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <defs>
        <filter id="shadow" x="0" y="0" width="36" height="48" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M18 4C10.82 4 5 9.82 5 17C5 26.5 18 42 18 42C18 42 31 26.5 31 17C31 9.82 25.18 4 18 4Z" fill="${color}" stroke="#ffffff" stroke-width="2.5"/>
        <circle cx="18" cy="17" r="5" fill="#ffffff"/>
      </g>
    </svg>
  `.trim();

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: typeof window !== "undefined" && window.google?.maps?.Size ? new window.google.maps.Size(34, 44) : undefined,
    anchor: typeof window !== "undefined" && window.google?.maps?.Point ? new window.google.maps.Point(17, 42) : undefined,
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
  const infoWindowRef = useRef<any>(null);
  const googlePickupMarkerRef = useRef<any>(null);
  const googleDropoffMarkerRef = useRef<any>(null);
  const googlePolylineRef = useRef<any>(null);
  const googlePolylineOutlineRef = useRef<any>(null);

  // Leaflet fallback references
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletPickupMarkerRef = useRef<L.Marker | null>(null);
  const leafletDropoffMarkerRef = useRef<L.Marker | null>(null);
  const leafletPolylineRef = useRef<L.Polyline | null>(null);

  // Auto-dismiss Google's billing error modals and policy covers
  useEffect(() => {
    if (!containerRef.current) return;

    const purgeOverlays = () => {
      const container = containerRef.current;
      if (!container) return;

      const pbcElements = container.querySelectorAll(".gm-style-pbc, .gm-style-pbt, .gm-style-moc");
      pbcElements.forEach((el) => {
        (el as HTMLElement).style.setProperty("display", "none", "important");
        (el as HTMLElement).style.setProperty("opacity", "0", "important");
      });

      const darkOverlays = container.querySelectorAll(".gm-style > div:first-child > div:last-child");
      darkOverlays.forEach((el) => {
        const bg = (el as HTMLElement).style.backgroundColor;
        if (bg && bg.includes("rgba(0, 0, 0")) {
          (el as HTMLElement).style.setProperty("display", "none", "important");
        }
      });

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

    purgeOverlays();
    const observer = new MutationObserver(purgeOverlays);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const interval = setInterval(purgeOverlays, 250);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [useGoogleMap]);

  // 1. Initialize Official Google Maps with Clickable Business POIs
  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = () => {
      if (typeof window !== "undefined" && window.google?.maps?.Map) {
        setUseGoogleMap(true);

        if (!googleMapRef.current) {
          const map = new window.google.maps.Map(containerRef.current, {
            center: { lat: 52.414, lng: -1.815 },
            zoom: 12,
            styles: GOOGLE_MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: true, // CRITICAL: Enables Google Business POI click events!
            gestureHandling: "greedy",
          });

          const infoWindow = new window.google.maps.InfoWindow();
          infoWindowRef.current = infoWindow;

          // Global callback for InfoWindow button
          (window as any).__setPoiCoords = (lat: number, lng: number) => {
            onMapClick(lat, lng);
            infoWindow.close();
          };

          // POI & Map Click Handler
          map.addListener("click", (e: any) => {
            if (e.placeId) {
              // User clicked a Google Business / Place POI!
              e.stop(); // Stop default navigation so our custom interactive card shows
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();

              const handlePlaceDetails = (placeName: string, address: string) => {
                infoWindow.setContent(`
                  <div style="font-family: 'Inter', system-ui, sans-serif; padding: 4px 6px; min-width: 170px;">
                    <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Google Business</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px; line-height: 1.3;">${placeName}</div>
                    ${address ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${address}</div>` : ""}
                    <div style="margin-top: 8px; display: flex; gap: 6px;">
                      <button onclick="window.__setPoiCoords && window.__setPoiCoords(${lat}, ${lng})" style="background: #059669; color: #ffffff; border: none; padding: 5px 9px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">Select Location</button>
                    </div>
                  </div>
                `);
                infoWindow.setPosition(e.latLng);
                infoWindow.open(map);
              };

              // Try Places API (New) first, fallback to PlacesService
              if (window.google?.maps?.places?.Place) {
                try {
                  const placeObj = new window.google.maps.places.Place({ id: e.placeId });
                  placeObj.fetchFields({ fields: ["displayName", "formattedAddress"] })
                    .then(() => {
                      handlePlaceDetails(placeObj.displayName || "Business Location", placeObj.formattedAddress || "");
                    })
                    .catch(() => {
                      if (window.google?.maps?.places?.PlacesService) {
                        const placesService = new window.google.maps.places.PlacesService(map);
                        placesService.getDetails(
                          { placeId: e.placeId, fields: ["name", "formatted_address"] },
                          (place: any) => {
                            handlePlaceDetails(place?.name || "Business Location", place?.formatted_address || "");
                          }
                        );
                      }
                    });
                } catch(err) {
                  if (window.google?.maps?.places?.PlacesService) {
                    const placesService = new window.google.maps.places.PlacesService(map);
                    placesService.getDetails(
                      { placeId: e.placeId, fields: ["name", "formatted_address"] },
                      (place: any) => {
                        handlePlaceDetails(place?.name || "Business Location", place?.formatted_address || "");
                      }
                    );
                  }
                }
              } else if (window.google?.maps?.places?.PlacesService) {
                const placesService = new window.google.maps.places.PlacesService(map);
                placesService.getDetails(
                  { placeId: e.placeId, fields: ["name", "formatted_address"] },
                  (place: any) => {
                    handlePlaceDetails(place?.name || "Business Location", place?.formatted_address || "");
                  }
                );
              }

              onMapClick(lat, lng);
            } else if (e.latLng) {
              infoWindow.close();
              onMapClick(e.latLng.lat(), e.latLng.lng());
            }
          });

          googleMapRef.current = map;
        }
      } else {
        // Fallback to Leaflet if Google script is loading
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

  // 2. Sync Coordinates, Markers, and Driving Route
  useEffect(() => {
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
          icon: getGoogleMarkerIcon("#10b981"),
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
          icon: getGoogleMarkerIcon("#f43f5e"),
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
      {/* Native Google Map Canvas */}
      <div
        ref={containerRef}
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
