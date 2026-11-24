import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, Plane, ArrowRight, Calendar, Clock, Users, Briefcase, 
  CreditCard, ShieldCheck, Compass, Check, AlertCircle, Phone, 
  HelpCircle, Receipt, Landmark, Activity, Car, AlertTriangle,
  Trash2, ArrowLeft, ArrowUp, ArrowDown, Plus, Navigation, Coins
} from "lucide-react";
import dynamic from "next/dynamic";
import { DistanceResult } from "../types";
import { trackClick } from "../utils/analytics";

const GoogleBookingMap = dynamic(() => import("./GoogleBookingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
      Loading interactive map...
    </div>
  ),
});

interface BookingCalculatorProps {
  initialPickup?: string;
  initialDropoff?: string;
  settings?: any;
}

interface RouteStreet {
  name: string;
  condition: "flowing" | "moderate" | "congested";
  speed: string;
  delay: string;
  remark: string;
  length: string;
}

const UK_LOCATIONS: { [key: string]: { lat: number; lng: number; name: string } } = {
  "shirley": { lat: 52.4140, lng: -1.8150, name: "Shirley, Solihull B90" },
  "solihull": { lat: 52.4135, lng: -1.7780, name: "Solihull, West Midlands" },
  "birmingham": { lat: 52.4862, lng: -1.8904, name: "Birmingham, West Midlands" },
  "bhx": { lat: 52.4539, lng: -1.7481, name: "Birmingham Airport (BHX)" },
  "lhr": { lat: 51.4700, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
  "heathrow": { lat: 51.4700, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
  "lgw": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
  "gatwick": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
  "man": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" },
  "manchester": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" },
  "ema": { lat: 52.8311, lng: -1.3280, name: "East Midlands Airport (EMA)" },
  "stn": { lat: 51.8860, lng: 0.2389, name: "London Stansted Airport (STN)" },
  "stansted": { lat: 51.8860, lng: 0.2389, name: "London Stansted Airport (STN)" },
  "ltn": { lat: 51.8763, lng: -0.3717, name: "London Luton Airport (LTN)" },
  "luton": { lat: 51.8763, lng: -0.3717, name: "London Luton Airport (LTN)" },
  "lcy": { lat: 51.5048, lng: 0.0495, name: "London City Airport (LCY)" },
  "london": { lat: 51.5074, lng: -0.1278, name: "London Central, UK" }
};

  const getRouteTrafficBreakdown = (pickup: string, dropoff: string, distance: number): RouteStreet[] => {
  const pLower = (pickup || "").toLowerCase();
  const dLower = (dropoff || "").toLowerCase();
  
  const streets: RouteStreet[] = [];
  
  // 1. Initial departure road
  if (pLower.includes("shirley")) {
    streets.push({
      name: "A34 Stratford Road (Shirley)",
      condition: "moderate",
      speed: "22 mph",
      delay: "2 mins",
      remark: "Slight local retail queue",
      length: "1.8 miles"
    });
  } else if (pLower.includes("solihull")) {
    streets.push({
      name: "B4102 Solihull Bypass / High Street",
      condition: "flowing",
      speed: "35 mph",
      delay: "0 mins",
      remark: "Clear, normal moving",
      length: "1.5 miles"
    });
  } else if (pLower.includes("birmingham")) {
    streets.push({
      name: "A38(M) Aston Expressway",
      condition: "flowing",
      speed: "45 mph",
      delay: "0 mins",
      remark: "Optimal road flow",
      length: "2.4 miles"
    });
  } else {
    streets.push({
      name: "Local Departure Streets",
      condition: "flowing",
      speed: "25 mph",
      delay: "0 mins",
      remark: "Optimal low-speed flow",
      length: "1.2 miles"
    });
  }
  
  // 2. High-speed highway or major road
  if (distance > 15) {
    if (dLower.includes("lhr") || dLower.includes("heathrow") || dLower.includes("london") || dLower.includes("lgw") || dLower.includes("gatwick")) {
      streets.push({
        name: "M42 Southbound (J3 to J3A)",
        condition: "flowing",
        speed: "68 mph",
        delay: "0 mins",
        remark: "Clear high-speed cruising",
        length: "11.2 miles"
      });
      streets.push({
        name: "M40 Motorway Eastbound",
        condition: "moderate",
        speed: "52 mph",
        delay: "2 mins",
        remark: "Slight queue near roadworks zone",
        length: "42.5 miles"
      });
      if (dLower.includes("lhr") || dLower.includes("heathrow")) {
        streets.push({
          name: "M25 London Orbital (J15 Terminal approach)",
          condition: "congested",
          speed: "18 mph",
          delay: "4 mins",
          remark: "Heavy peak traffic near terminal junction",
          length: "4.8 miles"
        });
      } else if (dLower.includes("lgw") || dLower.includes("gatwick")) {
        streets.push({
          name: "M25 Orbital & M23 Spur Link",
          condition: "moderate",
          speed: "42 mph",
          delay: "3 mins",
          remark: "Slow traffic near junction exit",
          length: "14.8 miles"
        });
      } else {
        streets.push({
          name: "M25 Orbital & Greater London highways",
          condition: "congested",
          speed: "22 mph",
          delay: "8 mins",
          remark: "High traffic density on approach",
          length: "12.0 miles"
        });
      }
    } else if (dLower.includes("bhx") || dLower.includes("birmingham") || dLower.includes("airport")) {
      streets.push({
        name: "M42 Motorway Northbound (J4 to J6)",
        condition: "flowing",
        speed: "65 mph",
        delay: "0 mins",
        remark: "Perfect optimal speed limit cruising",
        length: "4.2 miles"
      });
      streets.push({
        name: "A45 Coventry Road (Airport flyover)",
        condition: "moderate",
        speed: "28 mph",
        delay: "2 mins",
        remark: "Brief delays near active airport approach",
        length: "1.4 miles"
      });
    } else {
      streets.push({
        name: "M42 / Regional Motorway Link",
        condition: "flowing",
        speed: "64 mph",
        delay: "0 mins",
        remark: "Optimal high-speed flow",
        length: `${(distance * 0.7).toFixed(1)} miles`
      });
    }
  } else {
    // Shorter distance local roads
    streets.push({
      name: "Solihull Ring Road & A41",
      condition: "flowing",
      speed: "35 mph",
      delay: "0 mins",
      remark: "Normal suburban street traffic",
      length: `${(distance * 0.6).toFixed(1)} miles`
    });
  }
  
  // 3. Final approach road
  if (dLower.includes("bhx") || dLower.includes("birmingham airport")) {
    streets.push({
      name: "Airport Terminal Way",
      condition: "moderate",
      speed: "15 mph",
      delay: "1 min",
      remark: "Drop-off bay lane queuing",
      length: "0.5 miles"
    });
  } else if (dLower.includes("lhr") || dLower.includes("heathrow")) {
    streets.push({
      name: "Heathrow Airport Terminal Link Tunnel",
      condition: "congested",
      speed: "12 mph",
      delay: "3 mins",
      remark: "Dense stop-go traffic near security terminal",
      length: "0.7 miles"
    });
  } else {
    streets.push({
      name: "Destination Terminal Access Roads",
      condition: "flowing",
      speed: "20 mph",
      delay: "0 mins",
      remark: "Direct drop-off access clear",
      length: "0.6 miles"
    });
  }
  
  return streets;
};

// Presentational only: step names shown in the progress stepper (same wording as the current-step caption).
const STEP_LABELS = [
  "Instant Pricing Options",
  "Passenger Schedule Details",
  "Secure Checkout Gateway",
  "Reservation Confirmed",
];

export default function BookingCalculator({ initialPickup = "", initialDropoff = "", settings }: BookingCalculatorProps) {
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  // Native Google Places Autocomplete Service
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);

  useEffect(() => {
    const checkGoogle = () => {
      if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.places) {
        try {
          setAutocompleteService(new window.google.maps.places.AutocompleteService());
          const dummyDiv = document.createElement("div");
          setPlacesService(new window.google.maps.places.PlacesService(dummyDiv));
        } catch (e) {
          console.warn("Places init error:", e);
        }
      }
    };

    checkGoogle();
    const timer = setInterval(() => {
      if (window.google?.maps?.places) {
        checkGoogle();
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, []);

  // Input states
  const [pickupInput, setPickupInput] = useState(initialPickup);
  const [dropoffInput, setDropoffInput] = useState(initialDropoff);
  const [pickupVerified, setPickupVerified] = useState(Boolean(initialPickup));
  const [dropoffVerified, setDropoffVerified] = useState(Boolean(initialDropoff));
  const pickupDebounceRef = useRef<any>(null);
  const dropoffDebounceRef = useRef<any>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Booking Flow Steps
  // Step 1: Input route and view pricing side-by-side
  // Step 2: Enter date, time and customer info
  // Step 3: Secure checkout (Stripe or PayPal)
  // Step 4: Finished/Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected vehicle option
  const [selectedVehicle, setSelectedVehicle] = useState<"Economy" | "Luxury" | "Family" | null>(null);

  // Passenger & Ride Detail states
  const [rideDate, setRideDate] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerAlternatePhone, setPassengerAlternatePhone] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [luggageCount, setLuggageCount] = useState(1);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"Mollie" | "Pay Later">("Mollie");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Promo Code / Discount state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccessMsg, setPromoSuccessMsg] = useState("");
  const [paypalSimulating, setPaypalSimulating] = useState(false);

  // Completed reservation details
  const [completedBookingId, setCompletedBookingId] = useState("");
  const [completedBookingPrice, setCompletedBookingPrice] = useState(0);
  const [trafficToggle, setTrafficToggle] = useState(true);

  // Map references and interactive click states
  const mapRef = useRef<any>(null);
  const marker1Ref = useRef<any>(null);
  const marker2Ref = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const [mapClickMode, setMapClickMode] = useState<"pickup" | "dropoff">("pickup");
  const [customPickupCoords, setCustomPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  const [customDropoffCoords, setCustomDropoffCoords] = useState<{lat: number, lng: number} | null>(null);

  const leftFormRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!leftFormRef.current) return;
    const updateHeight = () => {
      if (leftFormRef.current) {
        const h = leftFormRef.current.offsetHeight;
        if (h > 0) setFormHeight(h);
      }
    };
    updateHeight();
    const rafId = requestAnimationFrame(() => {
      updateHeight();
    });
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(leftFormRef.current);
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [currentStep, selectedVehicle, distanceResult, customPickupCoords, customDropoffCoords, paymentMethod]);

  const [stops, setStops] = useState<{ id: string; address: string; duration: number; waiting: number; lat?: number; lng?: number }[]>([]);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
  const [stopSuggestions, setStopSuggestions] = useState<any[]>([]);

  const mapClickModeRef = useRef(mapClickMode);
  useEffect(() => {
    mapClickModeRef.current = mapClickMode;
  }, [mapClickMode]);

  const clearRoute = () => {
    setPickupInput("");
    setDropoffInput("");
    setCustomPickupCoords(null);
    setCustomDropoffCoords(null);
    setStops([]);
    setDistanceResult(null);
    setMapClickMode("pickup");
  };

  const handleAddStop = () => {
    setStops(prev => [
      ...prev,
      { id: Math.random().toString(), address: "", duration: 10, waiting: 5 }
    ]);
  };

  const handleRemoveStop = (index: number) => {
    setStops(prev => prev.filter((_, idx) => idx !== index));
  };

  const moveStop = (index: number, direction: 'up' | 'down') => {
    setStops(prev => {
      const nextStops = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < nextStops.length) {
        const temp = nextStops[index];
        nextStops[index] = nextStops[targetIndex];
        nextStops[targetIndex] = temp;
      }
      return nextStops;
    });
  };

  const handleStopInputChange = async (index: number, value: string) => {
    setStops(prev => {
      const updated = [...prev];
      updated[index].address = value;
      return updated;
    });
    setActiveStopIndex(index);
    if (value.length > 2) {
      const suggs = await fetchSuggestions(value);
      setStopSuggestions(suggs);
    } else {
      setStopSuggestions([]);
    }
  };

  const handleSelectStopSuggestion = (index: number, sugg: { lat: number; lng: number; name: string }) => {
    setStops(prev => {
      const updated = [...prev];
      updated[index].address = sugg.name;
      updated[index].lat = sugg.lat;
      updated[index].lng = sugg.lng;
      return updated;
    });
    setStopSuggestions([]);
    setActiveStopIndex(null);
  };

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setPickupInput("Detecting location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCustomPickupCoords({ lat, lng });
        
        let resolvedName = `Point on map (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(',');
              resolvedName = parts.slice(0, 3).map((p: any) => p.trim()).join(', ');
            }
          }
        } catch (err) {
          console.warn("Geocoding failed for current location:", err);
        }
        
        setPickupInput(resolvedName);
        setMapClickMode("dropoff");
      },
      (error) => {
        console.error("Geolocation error:", error);
        setPickupInput("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const useMyDropoffLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setDropoffInput("Detecting location...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setCustomDropoffCoords({ lat, lng });
        
        let resolvedName = `Point on map (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(',');
              resolvedName = parts.slice(0, 3).map((p: any) => p.trim()).join(', ');
            }
          }
        } catch (err) {
          console.warn("Geocoding failed for current location:", err);
        }
        
        setDropoffInput(resolvedName);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setDropoffInput("Location access denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  interface SuggestionItem {
    lat: number;
    lng: number;
    name: string;
    placeId?: string;
    mainText?: string;
    secondaryText?: string;
    type?: "airport" | "city" | "station" | "address";
  }

  const geocodeAddress = async (address: string, placeId?: string): Promise<{ lat: number; lng: number } | null> => {
    // 1. Try our secure UK backend geocode proxy
    try {
      const proxyRes = await fetch(`/api/places/geocode?address=${encodeURIComponent(address)}`);
      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data && data.lat && data.lng) {
          return { lat: Number(data.lat), lng: Number(data.lng) };
        }
      }
    } catch (e) {
      console.warn("Backend geocode error:", e);
    }

    if (typeof window !== "undefined" && window.google?.maps) {
      if (placeId && placesService) {
        try {
          const res = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
            placesService.getDetails(
              { placeId, fields: ["geometry", "formatted_address"] },
              (place: any, status: any) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                  resolve({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                } else {
                  resolve(null);
                }
              }
            );
          });
          if (res) return res;
        } catch (e) {
          console.warn("Places getDetails error:", e);
        }
      }
    }

    // Fallback to UK Nominatim Geocoder strictly bounded to GB
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gb&limit=1`, {
        headers: { 'Accept-Language': 'en-GB,en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
      }
    } catch (err) {
      console.error("OSM UK geocode fallback failed:", err);
    }
    return null;
  };

  const fetchSuggestions = async (query: string): Promise<SuggestionItem[]> => {
    if (!query || query.trim().length < 2) return [];

    const queryLower = query.toLowerCase().trim();
    const defaultMatches: SuggestionItem[] = Object.values(UK_LOCATIONS)
      .filter(loc => loc.name.toLowerCase().includes(queryLower))
      .map(loc => ({
        lat: loc.lat,
        lng: loc.lng,
        name: loc.name,
        mainText: loc.name.split(",")[0],
        secondaryText: loc.name.split(",").slice(1).join(",").trim() || "UK",
        type: loc.name.includes("Airport") ? "airport" : "city"
      }));

    // 1. Query robust backend autocomplete proxy (Postcodes.io + UK Nominatim / Photon GB + Google Places)
    try {
      const bRes = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(query)}`);
      if (bRes.ok) {
        const bData = await bRes.json();
        if (Array.isArray(bData) && bData.length > 0) {
          const combined = [...bData, ...defaultMatches];
          return Array.from(new Map(combined.map(item => [item.name, item])).values());
        }
      }
    } catch (e) {
      console.warn("Backend autocomplete fetch error, checking fallbacks:", e);
    }

    // 2. Direct Photon bounded to UK bounding box fallback
    try {
      const photonRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=-8.65,49.86,1.78,60.86&limit=8`);
      if (photonRes.ok) {
        const pdata = await photonRes.json();
        if (pdata && pdata.features && pdata.features.length > 0) {
          const photonResults: SuggestionItem[] = pdata.features
            .filter((f: any) => {
              const country = (f.properties?.country || "").toLowerCase();
              return !country || country.includes("kingdom") || country.includes("uk") || country.includes("britain");
            })
            .map((f: any) => {
              const p = f.properties || {};
              const name = p.name || "";
              const street = [p.housenumber, p.street].filter(Boolean).join(" ");
              const locParts = [street, p.city || p.town || p.district, p.postcode, "UK"].filter(Boolean);
              const fullLabel = [name, ...locParts].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
              const isAirport = name.toLowerCase().includes("airport") || (p.osm_value && p.osm_value.includes("aerodrome"));
              
              return {
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                name: fullLabel || name,
                mainText: name || locParts[0] || fullLabel,
                secondaryText: locParts.join(", "),
                type: isAirport ? "airport" : "address"
              };
            });

          const combined = [...photonResults, ...defaultMatches];
          return Array.from(new Map(combined.map(item => [item.name, item])).values());
        }
      }
    } catch (e) {}

    return defaultMatches;
  };

  const handleSelectSuggestion = async (loc: SuggestionItem, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setPickupInput(loc.name);
      setPickupSuggestions([]);
      setPickupVerified(true);
    } else {
      setDropoffInput(loc.name);
      setDropoffSuggestions([]);
      setDropoffVerified(true);
    }

    let coords = { lat: loc.lat, lng: loc.lng };
    if (coords.lat === 0 && coords.lng === 0) {
      const resolved = await geocodeAddress(loc.name, loc.placeId);
      if (resolved) {
        coords = resolved;
      }
    }

    if (type === 'pickup') {
      setCustomPickupCoords(coords);
    } else {
      setCustomDropoffCoords(coords);
    }
  };

  const handleInput = (val: string, type: 'pickup' | 'dropoff', resetCoords = true) => {
    if (type === 'pickup') {
      setPickupInput(val);
      setPickupVerified(false);
      if (resetCoords) setCustomPickupCoords(null);
      if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current);

      if (val.trim().length < 2) {
        setPickupSuggestions([]);
        return;
      }

      // 320ms debounce to prevent wasted API calls and ensure instant responsive typing
      pickupDebounceRef.current = setTimeout(async () => {
        const suggestions = await fetchSuggestions(val);
        setPickupSuggestions(suggestions);
      }, 320);
    } else {
      setDropoffInput(val);
      setDropoffVerified(false);
      if (resetCoords) setCustomDropoffCoords(null);
      if (dropoffDebounceRef.current) clearTimeout(dropoffDebounceRef.current);

      if (val.trim().length < 2) {
        setDropoffSuggestions([]);
        return;
      }

      // 320ms debounce to prevent wasted API calls and ensure instant responsive typing
      dropoffDebounceRef.current = setTimeout(async () => {
        const suggestions = await fetchSuggestions(val);
        setDropoffSuggestions(suggestions);
      }, 320);
    }
  };
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setPickupSuggestions([]);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setDropoffSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sync initial inputs when passed down as props (e.g. from airports list)
  useEffect(() => {
    if (initialPickup) setPickupInput(initialPickup);
    if (initialDropoff) setDropoffInput(initialDropoff);
    if (initialPickup && initialDropoff) {
      calculateDistance(initialPickup, initialDropoff);
    }
  }, [initialPickup, initialDropoff]);
  useEffect(() => {
    if (customPickupCoords && customDropoffCoords && pickupInput && dropoffInput && pickupInput !== "Resolving address..." && dropoffInput !== "Resolving address...") {
      calculateDistance(pickupInput, dropoffInput);
    }
  }, [customPickupCoords, customDropoffCoords]);

  const handleMapClick = async (lat: number, lng: number) => {
    const currentMode = mapClickMode;
    
    if (currentMode === "pickup") {
      setPickupInput("Resolving address...");
    } else {
      setDropoffInput("Resolving address...");
    }
    
    let resolvedName = `Point on map (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    let resolvedWithGoogle = false;

    // Try Google Geocoding first
    if (typeof google !== "undefined" && google.maps && google.maps.Geocoder) {
      try {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat, lng };
        await new Promise<void>((resolve) => {
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              resolvedName = results[0].formatted_address;
              resolvedWithGoogle = true;
            }
            resolve();
          });
        });
      } catch (err) {
        console.warn("Google reverse geocoding failed, trying OSM Nominatim:", err);
      }
    }

    if (!resolvedWithGoogle) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
          headers: { 'Accept-Language': 'en' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const parts = data.display_name.split(',');
            resolvedName = parts.slice(0, 3).map((p: any) => p.trim()).join(', ');
          }
        }
      } catch (err) {
        console.warn("Geocoding failed, using coordinates fallback.", err);
      }
    }
    
    if (currentMode === "pickup") {
      setPickupInput(resolvedName);
      setCustomPickupCoords({ lat, lng });
      setPickupVerified(true);
      setMapClickMode("dropoff");
    } else {
      setDropoffInput(resolvedName);
      setCustomDropoffCoords({ lat, lng });
      setDropoffVerified(true);
      setMapClickMode("pickup");
    }
  };

  const handleRouteCalculated = async (result: {
    distanceMiles: number;
    timeMinutes: number;
    routePoints: { lat: number; lng: number }[];
    instructions: string[];
  }) => {
    setLoadingRoute(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: pickupInput,
          dropoff: dropoffInput,
          pickupCoords: customPickupCoords,
          dropoffCoords: customDropoffCoords,
          precalculated: result,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDistanceResult(data);
      } else {
        console.error("Failed to fetch price details for Google route");
      }
    } catch (err) {
      console.error("Failed contacting pricing server:", err);
    } finally {
      setLoadingRoute(false);
    }
  };

  const getClientSideFallbackRoute = (pickup: string, dropoff: string, precalc?: any) => {
    const UK_LOCATIONS: { [key: string]: { lat: number; lng: number; name: string } } = {
      "shirley": { lat: 52.4140, lng: -1.8150, name: "Shirley, Solihull B90" },
      "solihull": { lat: 52.4135, lng: -1.7780, name: "Solihull, West Midlands" },
      "birmingham": { lat: 52.4862, lng: -1.8904, name: "Birmingham, West Midlands" },
      "bhx": { lat: 52.4539, lng: -1.7481, name: "Birmingham Airport (BHX)" },
      "lhr": { lat: 51.4700, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
      "heathrow": { lat: 51.4700, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
      "lgw": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
      "gatwick": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
      "man": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" },
      "manchester": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" },
      "ema": { lat: 52.8311, lng: -1.3280, name: "East Midlands Airport (EMA)" },
      "stn": { lat: 51.8860, lng: 0.2389, name: "London Stansted Airport (STN)" },
      "stansted": { lat: 51.8860, lng: 0.2389, name: "London Stansted Airport (STN)" },
      "ltn": { lat: 51.8763, lng: -0.3717, name: "London Luton Airport (LTN)" },
      "luton": { lat: 51.8763, lng: -0.3717, name: "London Luton Airport (LTN)" },
      "lcy": { lat: 51.5048, lng: 0.0495, name: "London City Airport (LCY)" },
      "london": { lat: 51.5074, lng: -0.1278, name: "London Central, UK" }
    };

    const pNorm = pickup.toLowerCase();
    const dNorm = dropoff.toLowerCase();

    const hashStringToCoords = (str: string, defaultLat: number, defaultLng: number) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const latOffset = (Math.abs(hash % 1000) / 1000) * 0.4 - 0.2;
      const lngOffset = (Math.abs((hash >> 3) % 1000) / 1000) * 0.4 - 0.2;
      return { lat: defaultLat + latOffset, lng: defaultLng + lngOffset };
    };

    let pCoords = UK_LOCATIONS.shirley;
    if (customPickupCoords) {
      pCoords = { lat: customPickupCoords.lat, lng: customPickupCoords.lng, name: pickup };
    } else {
      let pMatched = false;
      for (const [key, loc] of Object.entries(UK_LOCATIONS)) {
        if (pNorm.includes(key)) {
          pCoords = loc;
          pMatched = true;
          break;
        }
      }
      if (!pMatched) {
        const coords = hashStringToCoords(pNorm, 52.4140, -1.8150);
        pCoords = { lat: coords.lat, lng: coords.lng, name: pickup };
      }
    }

    let dCoords = UK_LOCATIONS.bhx;
    if (customDropoffCoords) {
      dCoords = { lat: customDropoffCoords.lat, lng: customDropoffCoords.lng, name: dropoff };
    } else {
      let dMatched = false;
      for (const [key, loc] of Object.entries(UK_LOCATIONS)) {
        if (dNorm.includes(key)) {
          dCoords = loc;
          dMatched = true;
          break;
        }
      }
      if (!dMatched) {
        const coords = hashStringToCoords(dNorm, 51.4700, -0.4543);
        dCoords = { lat: coords.lat, lng: coords.lng, name: dropoff };
      }
    }

    const R = 3958.8; // Radius of Earth in miles
    const dLat = (dCoords.lat - pCoords.lat) * Math.PI / 180;
    const dLon = (dCoords.lng - pCoords.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pCoords.lat * Math.PI / 180) * Math.cos(dCoords.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLineDist = R * c;

    // Accurate road circuity factor (~1.2) for UK roads
    let distanceMiles = Number((straightLineDist > 0 ? straightLineDist * 1.2 : 1.0).toFixed(1));
    const distanceKm = Number((distanceMiles * 1.60934).toFixed(1));

    let timeMinutes = Math.max(5, Math.round((distanceMiles / 35) * 60));

    let points = [];
    let instructions = [
      `Start journey at ${pCoords.name}`,
      distanceMiles > 15 ? "Join major motorway (M42 / M40 / M6)" : "Proceed along local A-roads",
      distanceMiles > 40 ? "Follow regional highway signs" : "Navigate towards local signs",
      `Arrive at your destination: ${dCoords.name}`
    ];

    if (precalc && precalc.distanceMiles && Array.isArray(precalc.routePoints)) {
      distanceMiles = Number(Number(precalc.distanceMiles).toFixed(1));
      timeMinutes = precalc.timeMinutes || timeMinutes;
      points = precalc.routePoints;
      instructions = precalc.instructions || instructions;
    } else {
      const steps = 15;
      const pLat = -(dCoords.lng - pCoords.lng);
      const pLng = (dCoords.lat - pCoords.lat);
      const len = Math.sqrt(pLat * pLat + pLng * pLng);

      for (let i = 0; i <= steps; i++) {
        const fraction = i / steps;
        const midLat = pCoords.lat + (dCoords.lat - pCoords.lat) * fraction;
        const midLng = pCoords.lng + (dCoords.lng - pCoords.lng) * fraction;

        if (len > 0) {
          const uLat = pLat / len;
          const uLng = pLng / len;
          const wiggle = Math.sin(fraction * Math.PI) * len * 0.12;
          points.push({
            lat: midLat + uLat * wiggle,
            lng: midLng + uLng * wiggle
          });
        } else {
          points.push({ lat: midLat, lng: midLng });
        }
      }
    }

    const totalWaitMins = stops.reduce((acc, s) => acc + (Number(s.waiting) || 0), 0);
    const waitingChargeAmt = totalWaitMins * 0.50;

    const effectiveDistance = Math.max(distanceMiles, 10.00);
    const prices = {
      Economy: Number((effectiveDistance * 1.50 + waitingChargeAmt).toFixed(2)),
      Luxury: Number((effectiveDistance * 2.00 + waitingChargeAmt).toFixed(2)),
      Family: Number((effectiveDistance * 2.50 + waitingChargeAmt).toFixed(2))
    };

    return {
      distanceMiles,
      distanceKm,
      distance: distanceMiles,
      distanceText: `${distanceMiles} mi (${distanceKm} km)`,
      timeMinutes,
      duration: timeMinutes,
      pickupLat: pCoords.lat,
      pickupLng: pCoords.lng,
      dropoffLat: dCoords.lat,
      dropoffLng: dCoords.lng,
      routePoints: points,
      instructions,
      pickupDisplay: pCoords.name,
      dropoffDisplay: dCoords.name,
      prices,
      waitingTime: totalWaitMins,
      waitingChargeAmount: Number(waitingChargeAmt.toFixed(2)),
      source: "client-fallback"
    };
  };

  // Execute calculation
  const calculateDistance = async (pick = pickupInput, drop = dropoffInput, currentStops = stops) => {
    if (!pick || !drop) {
      setErrorMsg("Please provide both Pickup and Dropoff locations.");
      return;
    }
    setErrorMsg("");
    setLoadingRoute(true);
    setDistanceResult(null);
    trackClick("get_quote");

    let precalculated: any = null;

    try {
      // 1. Resolve coordinates on client-side if missing or 0,0
      let pCoords = customPickupCoords;
      if (!pCoords || (pCoords.lat === 0 && pCoords.lng === 0)) {
        const resolved = await geocodeAddress(pick);
        if (resolved) {
          pCoords = resolved;
          setCustomPickupCoords(pCoords);
        } else {
          const resolvedSug = await fetchSuggestions(pick);
          if (resolvedSug && resolvedSug.length > 0 && resolvedSug[0].lat !== 0) {
            pCoords = { lat: resolvedSug[0].lat, lng: resolvedSug[0].lng };
            setCustomPickupCoords(pCoords);
          }
        }
      }

      let dCoords = customDropoffCoords;
      if (!dCoords || (dCoords.lat === 0 && dCoords.lng === 0)) {
        const resolved = await geocodeAddress(drop);
        if (resolved) {
          dCoords = resolved;
          setCustomDropoffCoords(dCoords);
        } else {
          const resolvedSug = await fetchSuggestions(drop);
          if (resolvedSug && resolvedSug.length > 0 && resolvedSug[0].lat !== 0) {
            dCoords = { lat: resolvedSug[0].lat, lng: resolvedSug[0].lng };
            setCustomDropoffCoords(dCoords);
          }
        }
      }

      // Geocode intermediate stops if missing coordinates
      const stopsWithCoords = await Promise.all(currentStops.map(async (stop) => {
        if (stop.lat !== undefined && stop.lng !== undefined) {
          return stop;
        }
        const resolved = await fetchSuggestions(stop.address);
        if (resolved && resolved.length > 0) {
          return { ...stop, lat: resolved[0].lat, lng: resolved[0].lng };
        }
        return stop;
      }));

      // Update stops with geocoded coordinates if updated
      let updatedStops = false;
      const finalStops = stopsWithCoords.map((stop, index) => {
        const original = currentStops[index];
        if (stop.lat !== original?.lat || stop.lng !== original?.lng) {
          updatedStops = true;
        }
        return stop;
      });
      if (updatedStops) {
        setStops(finalStops);
      }

      if (!pCoords || !dCoords) {
        setErrorMsg("We could not pinpoint this UK address. Please select a suggestion from the UK dropdown, enter a valid UK postcode, or tap on the map to pin your location.");
        setLoadingRoute(false);
        return;
      }

      // 2. Fetch OSRM route directly from client (bypasses Server rate limits completely)
      if (pCoords && dCoords) {
        try {
          const validStops = finalStops.filter(s => s.lat !== undefined && s.lng !== undefined);
          const stopCoordsStr = validStops.map(s => `${s.lng},${s.lat}`).join(";");
          const coordsChain = [
            `${pCoords.lng},${pCoords.lat}`,
            ...(stopCoordsStr ? [stopCoordsStr] : []),
            `${dCoords.lng},${dCoords.lat}`
          ].join(";");

          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsChain}?overview=full&geometries=geojson&steps=true`;
          const osrmRes = await fetch(osrmUrl);
          if (osrmRes.ok) {
            const osrmData = await osrmRes.json();
            if (osrmData.routes && osrmData.routes.length > 0) {
              const route = osrmData.routes[0];
              const distMiles = route.distance / 1609.34;
              const timeMinutes = route.duration / 60;
              const routePoints = route.geometry.coordinates.map((coord: [number, number]) => ({
                lat: coord[1],
                lng: coord[0]
              }));

              // Parse turn-by-turn steps
              let instructions: string[] = [];
              if (route.legs) {
                route.legs.forEach((leg: any, legIdx: number) => {
                  if (leg.steps) {
                    const legSteps = leg.steps.map((step: any) => {
                      const maneuver = step.maneuver || {};
                      const type = maneuver.type || "";
                      const modifier = maneuver.modifier || "";
                      const name = step.name || "";
                      let actionText = "";
                      switch (type) {
                        case "depart":
                          actionText = name ? `Depart heading near ${name}` : "Depart starting point";
                          break;
                        case "arrive":
                          actionText = name ? `Arrive at waypoint/destination on ${name}` : "Arrive at stop/destination";
                          break;
                        case "turn":
                          actionText = `Turn ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "new name":
                          actionText = `Continue onto ${name}`;
                          break;
                        case "merge":
                          actionText = `Merge ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "on ramp":
                          actionText = `Take the ramp ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "off ramp":
                          actionText = `Take exit ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "fork":
                          actionText = `Take the fork ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "roundabout":
                          actionText = `At the roundabout, take exit ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        case "rotary":
                          actionText = `Enter the rotary and exit ${modifier} ${name ? `onto ${name}` : ""}`;
                          break;
                        default:
                          actionText = `${type} ${modifier} ${name ? `onto ${name}` : ""}`;
                      }
                      actionText = actionText.replace(/\s+/g, " ").trim();
                      return actionText.charAt(0).toUpperCase() + actionText.slice(1);
                    });
                    instructions = [...instructions, `[Leg ${legIdx + 1}]`, ...legSteps];
                  }
                });
              }

              if (instructions.length === 0) {
                instructions = ["Follow driving route calculated via OSRM"];
              }

              precalculated = {
                distanceMiles: distMiles,
                timeMinutes: timeMinutes,
                routePoints: routePoints,
                instructions: instructions
              };
            }
          }
        } catch (err) {
          console.warn("Client-side OSRM routing failed, falling back to server-side estimation:", err);
        }
      }

      // 3. Request pricing/route details from backend (passing precalculated route data if available)
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pickup: pick, 
          dropoff: drop,
          pickupCoords: pCoords,
          dropoffCoords: dCoords,
          precalculated: precalculated,
          stops: finalStops
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDistanceResult(data);
      } else {
        console.warn("Server distance check failed. Proceeding with client-side estimation fallback.");
        const fallbackData = getClientSideFallbackRoute(pick, drop, precalculated);
        setDistanceResult(fallbackData);
      }
    } catch (err) {
      console.warn("Error calculating route. Proceeding with client-side estimation fallback.", err);
      const fallbackData = getClientSideFallbackRoute(pick, drop, precalculated);
      setDistanceResult(fallbackData);
    } finally {
      setLoadingRoute(false);
    }
  };

  // Stripe card fields helper formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(v);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      setCardExpiry(`${v.substring(0, 2)}/${v.substring(2, 4)}`);
    } else {
      setCardExpiry(v);
    }
  };

  // Bookings submission trigger
  const handleReserveDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rideDate || !rideTime || !passengerName || !passengerEmail || !passengerPhone || !selectedVehicle || !distanceResult) {
      alert("Please fill in all requested fields.");
      return;
    }
    // Transition to payment checkout
    setCurrentStep(3);
  };

  // Promo Code validation & application
  const handleApplyPromoCode = async () => {
    const raw = promoInput.trim().toUpperCase();
    if (!raw) {
      setPromoError("Please enter a promo code.");
      return;
    }
    const baseAmount = distanceResult && selectedVehicle ? distanceResult.prices[selectedVehicle] : 0;
    if (baseAmount <= 0) {
      setPromoError("Please select a valid ride option first.");
      return;
    }

    setPromoLoading(true);
    setPromoError("");
    setPromoSuccessMsg("");

    try {
      const res = await fetch("/api/promocodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: raw, amount: baseAmount, email: passengerEmail })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromo(data.coupon || data.promo);
        setPromoDiscountAmount(data.discountAmount);
        setPromoSuccessMsg(data.message || `Coupon code '${raw}' applied!`);
      } else {
        setAppliedPromo(null);
        setPromoDiscountAmount(0);
        setPromoError(data.message || "Invalid or ineligible coupon code.");
      }
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoDiscountAmount(0);
      setPromoError("Could not connect to coupon verification server.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscountAmount(0);
    setPromoInput("");
    setPromoError("");
    setPromoSuccessMsg("");
  };

  // Distance parameters
  const originalBasePrice = distanceResult && selectedVehicle ? distanceResult.prices[selectedVehicle] : 0;
  const finalPayablePrice = Math.max(0, Math.round((originalBasePrice - promoDiscountAmount) * 100) / 100);
  const selectedPrice = finalPayablePrice;

  // Payment finalizer
  const processCheckoutPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!distanceResult || !selectedVehicle) return;

    setProcessingPayment(true);

    const price = finalPayablePrice;

    const distMiles = distanceResult.distanceMiles ?? (Number((distanceResult as any).distance) || 0);
    const distKm = distanceResult.distanceKm || (distMiles * 1.60934);
    const distText = `${distMiles.toFixed(1)} mi (${distKm.toFixed(1)} km)`;

    const payload = {
      pickup: distanceResult.pickupDisplay || pickupInput,
      dropoff: distanceResult.dropoffDisplay || dropoffInput,
      pickupCoords: { lat: distanceResult.pickupLat, lng: distanceResult.pickupLng },
      dropoffCoords: { lat: distanceResult.dropoffLat, lng: distanceResult.dropoffLng },
      distance: distMiles,
      distanceMiles: distMiles,
      distanceKm: distKm,
      distanceText: distText,
      duration: distanceResult.timeMinutes ?? (distanceResult as any).duration,
      stops: stops.map(s => ({ address: s.address, duration: s.duration, waiting: s.waiting, lat: s.lat, lng: s.lng })),
      waitingTime: stops.reduce((acc, s) => acc + (Number(s.waiting) || 0), 0),
      date: rideDate,
      time: rideTime,
      vehicle: selectedVehicle,
      price: finalPayablePrice,
      originalPrice: originalBasePrice,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      discountAmount: promoDiscountAmount,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerAlternatePhone,
      flightNumber,
      passengers: passengerCount,
      luggage: luggageCount,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "Pay Later" ? "Unpaid" : "Paid",
      status: "Pending"
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        trackClick("book_now");
        const data = await res.json();
        setCompletedBookingId(data.booking.id);
        setCompletedBookingPrice(data.booking?.price ?? finalPayablePrice);
        
        // Dispatch simulation payment server update
        await fetch("/api/bookings/payment-simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: data.booking.id,
            paymentMethod: paymentMethod,
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          })
        });

        setCurrentStep(4);
      } else {
        alert("Server failed to register the booking. Please check logs.");
      }
    } catch (err) {
      alert("Payment processor connection failed.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Check for Mollie redirect success params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingStatus = params.get("bookingStatus");
    const bookingId = params.get("bookingId");
    if (bookingStatus === "success" && bookingId) {
      // Verify payment status with the server
      fetch(`/api/mollie/status/${bookingId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && (data.paymentStatus === "Paid" || data.status === "Pending")) {
            setCompletedBookingId(bookingId);
            setPaymentMethod("Mollie");
            setCurrentStep(4);
          } else {
            alert("Payment was not completed. Your booking has not been registered.");
            setCurrentStep(1);
          }
        })
        .catch(err => {
          console.error("Failed to verify payment status:", err);
          alert("We could not confirm your payment status. Please contact support.");
          setCurrentStep(1);
        })
        .finally(() => {
          // Clean query params
          window.history.replaceState({}, "", window.location.pathname);
        });
    }
  }, []);

  // Mollie Payment Handler
  const handleMollieCheckout = async () => {
    if (!distanceResult || !selectedVehicle) return;
    setProcessingPayment(true);
    const price = distanceResult.prices[selectedVehicle];

    const distMiles = distanceResult.distanceMiles ?? (Number((distanceResult as any).distance) || 0);
    const distKm = distanceResult.distanceKm || (distMiles * 1.60934);
    const distText = `${distMiles.toFixed(1)} mi (${distKm.toFixed(1)} km)`;

    const payload = {
      pickup: distanceResult.pickupDisplay || pickupInput,
      dropoff: distanceResult.dropoffDisplay || dropoffInput,
      pickupCoords: { lat: distanceResult.pickupLat, lng: distanceResult.pickupLng },
      dropoffCoords: { lat: distanceResult.dropoffLat, lng: distanceResult.dropoffLng },
      distance: distMiles,
      distanceMiles: distMiles,
      distanceKm: distKm,
      distanceText: distText,
      duration: distanceResult.timeMinutes ?? (distanceResult as any).duration,
      stops: stops.map(s => ({ address: s.address, duration: s.duration, waiting: s.waiting, lat: s.lat, lng: s.lng })),
      waitingTime: stops.reduce((acc, s) => acc + (Number(s.waiting) || 0), 0),
      date: rideDate,
      time: rideTime,
      vehicle: selectedVehicle,
      price: finalPayablePrice,
      originalPrice: originalBasePrice,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      discountAmount: promoDiscountAmount,
      passengerName,
      passengerEmail,
      passengerPhone,
      passengerAlternatePhone,
      flightNumber,
      passengers: passengerCount,
      luggage: luggageCount,
      paymentMethod: "Mollie"
    };

    try {
      const res = await fetch("/api/mollie/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed to initialize Mollie payment gateway.");
      }
    } catch (err: any) {
      console.error("Mollie payment error:", err);
      alert("Could not connect to Mollie payment gateway.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // PayPal checkout mock popup
  const handlePayPalCheckout = () => {
    setPaypalSimulating(true);
    setTimeout(() => {
      // Simulate successful confirmation inside popup callback
      setPaypalSimulating(false);
      setPaymentMethod("PayPal");
      processCheckoutPayment();
    }, 2500);
  };

  return (
    <section id="calculator" className="tl-section bg-ivory text-stone-700 relative">
      <div className="tl-container">

        {/* Section Header */}
        <div className="mb-12 lg:mb-14">
          <span data-reveal className="tl-eyebrow">Instant Booking System</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4">
            Calculate & Book Your Chauffeur
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
            Get instant, guaranteed prices side by side and complete a secure checkout in under 60 seconds. Whether you need private hire Birmingham for an airport run, a business meeting or a special night out, simply enter your pickup and drop-off to see your fixed fare.
          </p>
        </div>

        {/* Outer Split Panel Card */}
        <div data-reveal="fade" className="tl-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-12 lg:gap-y-10 rounded-sm p-6 sm:p-10 relative items-stretch">

          {/* STEPPER METADATA SUBBAR */}
          <div className="lg:col-span-12 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="text-sm text-stone-500">Booking progress:</span>
              <div className="text-sm font-medium text-brand-800 lg:hidden">
                {currentStep === 1 && "1. Instant Pricing Options"}
                {currentStep === 2 && "2. Passenger Schedule Details"}
                {currentStep === 3 && "3. Secure Checkout Gateway"}
                {currentStep === 4 && "4. Reservation Confirmed"}
              </div>
            </div>
            <ol aria-label="Booking progress" className="mt-4 grid grid-cols-4 border-b border-stone-200">
              {[1, 2, 3, 4].map((step) => (
                <li
                  key={step}
                  aria-current={currentStep === step ? "step" : undefined}
                  className={`-mb-px flex items-baseline gap-2.5 border-b-2 pb-3 pr-4 text-sm transition-colors duration-200 ${
                    currentStep === step
                      ? "border-brand-700 font-medium text-brand-800"
                      : currentStep > step
                      ? "border-transparent text-stone-700"
                      : "border-transparent text-stone-400"
                  }`}
                >
                  <span className="tabular-nums">{step}</span>
                  <span className="hidden lg:inline">{STEP_LABELS[step - 1]}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* LEFT BLOCK: INPUTS & VEHICLES & FORMS (Colspan 7) */}
          <div ref={leftFormRef} className="lg:col-span-7 flex flex-col self-start w-full min-w-0">

            {/* STEP 1: CALCULATOR / VEHICLE SELECT */}
            {currentStep === 1 && (
              <div className="space-y-8">

                {/* Inputs card */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="tl-h3">Where would you like to travel?</h3>

                    <div className="space-y-5">
                      <div className="relative" ref={pickupRef}>
                        <label className="block">
                          <span className="tl-label">Pick-up location</span>
                          <span className="relative block">
                            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-stone-400">P</span>
                            <input
                              type="text"
                              placeholder="Enter Pick-up Location or Postal Code..."
                              value={pickupInput}
                              onChange={(e) => {
                                handleInput(e.target.value, 'pickup');
                              }}
                              onFocus={() => handleInput(pickupInput, 'pickup', false)}
                              className="tl-input pl-11 pr-12 text-ellipsis"
                            />
                          </span>
                        </label>
                        <button type="button" onClick={useMyLocation} aria-label="Use my current location for pick-up" className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center text-stone-400 transition-colors duration-200 hover:text-brand-700"><Compass className="w-5 h-5" strokeWidth={1.5} /></button>
                        {pickupSuggestions.length > 0 && (
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-stone-200 bg-white shadow-sm">
                            {pickupSuggestions.map((loc, idx) => (
                              <div
                                key={idx}
                                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 hover:bg-stone-50"
                                onClick={() => handleSelectSuggestion(loc, 'pickup')}
                              >
                                {loc.type === "airport" ? (
                                  <Plane className="h-5 w-5 shrink-0 text-stone-400" strokeWidth={1.5} />
                                ) : (
                                  <MapPin className="h-5 w-5 shrink-0 text-stone-400" strokeWidth={1.5} />
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="truncate font-medium text-stone-900">
                                    {loc.mainText || loc.name}
                                  </span>
                                  {loc.secondaryText && (
                                    <span className="truncate text-xs text-stone-500">
                                      {loc.secondaryText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>



                      <div className="relative" ref={dropoffRef}>
                        <label className="block">
                          <span className="tl-label">Drop-off location</span>
                          <span className="relative block">
                            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-stone-400">D</span>
                            <input
                              type="text"
                              placeholder="Enter Drop-off Destination or Airport..."
                              value={dropoffInput}
                              onChange={(e) => {
                                handleInput(e.target.value, 'dropoff');
                              }}
                              onFocus={() => handleInput(dropoffInput, 'dropoff', false)}
                              className="tl-input pl-11 pr-12 text-ellipsis"
                            />
                          </span>
                        </label>
                        <button type="button" onClick={useMyDropoffLocation} aria-label="Use my current location for drop-off" className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center text-stone-400 transition-colors duration-200 hover:text-brand-700"><Compass className="w-5 h-5" strokeWidth={1.5} /></button>
                        {dropoffSuggestions.length > 0 && (
                          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-stone-200 bg-white shadow-sm">
                            {dropoffSuggestions.map((loc, idx) => (
                              <div
                                key={idx}
                                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 hover:bg-stone-50"
                                onClick={() => handleSelectSuggestion(loc, 'dropoff')}
                              >
                                {loc.type === "airport" ? (
                                  <Plane className="h-5 w-5 shrink-0 text-stone-400" strokeWidth={1.5} />
                                ) : (
                                  <MapPin className="h-5 w-5 shrink-0 text-stone-400" strokeWidth={1.5} />
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="truncate font-medium text-stone-900">
                                    {loc.mainText || loc.name}
                                  </span>
                                  {loc.secondaryText && (
                                    <span className="truncate text-xs text-stone-500">
                                      {loc.secondaryText}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-stone-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.5} />
                      <span>Search any UK postcode, city or airport, or click anywhere on the map to pin exact locations.</span>
                    </div>

                    {errorMsg && (
                      <div role="alert" className="flex items-start gap-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-5">
                      <label className="block min-w-0 flex-1">
                        <span className="tl-label">Date</span>
                        <span className="relative block">
                          <Calendar aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                          <input
                            type="date"
                            value={rideDate}
                            onChange={(e) => setRideDate(e.target.value)}
                            className="tl-input pl-11"
                          />
                        </span>
                      </label>
                      <label className="block min-w-0 flex-1">
                        <span className="tl-label">Time</span>
                        <span className="relative block">
                          <Clock aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                          <input
                            type="time"
                            value={rideTime}
                            onChange={(e) => setRideTime(e.target.value)}
                            className="tl-input pl-11"
                          />
                        </span>
                      </label>
                    </div>

                    <div role="group" aria-label="Vehicle class">
                      <span className="tl-label">Vehicle class</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Economy", "Luxury", "Family"].map((vehicle) => {
                          const rates: Record<string, string> = {
                            Economy: "£1.50/mi",
                            Luxury: "£2.00/mi",
                            Family: "£2.50/mi"
                          };
                          return (
                            <button
                              key={vehicle}
                              type="button"
                              onClick={() => setSelectedVehicle(vehicle as any)}
                              aria-pressed={selectedVehicle === vehicle}
                              className={`tl-card flex h-12 cursor-pointer items-center rounded-sm px-4 text-sm font-medium sm:justify-center ${
                                selectedVehicle === vehicle
                                  ? "border-brand-700 ring-1 ring-brand-700 bg-brand-50/40 text-brand-800"
                                  : "tl-card-hover text-stone-700"
                              }`}
                            >
                              <span>
                                {vehicle === "Family" ? "Family / MPV" : vehicle}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => calculateDistance()}
                      disabled={loadingRoute}
                      className="tl-btn tl-btn-primary min-w-0 flex-1"
                    >
                      {loadingRoute ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Calculating Route...</span>
                        </>
                      ) : (
                        <>
                          <span>Calculate Quote</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearRoute}
                      className="tl-btn tl-btn-outline w-12 shrink-0 px-0 text-stone-600"
                      title="Clear Route"
                      aria-label="Clear Route"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>

                </div>

                {/* Pricing display panels shown first */}
                {distanceResult && (
                  <div className="space-y-6 border-t border-stone-200 pt-8">
                    <h4 className="tl-h3">Route & Pricing Summary</h4>

                    <dl className="divide-y divide-stone-200 border-y border-stone-200 text-sm">
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">Total Distance</dt>
                        <dd className="text-right font-medium text-stone-900 tabular-nums">
                          {(distanceResult.distanceMiles ?? distanceResult.distance ?? 0).toFixed(1)} mi
                          <span className="ml-1 font-normal text-stone-500">
                            ({(distanceResult.distanceKm || (distanceResult.distanceMiles ?? distanceResult.distance ?? 0) * 1.60934).toFixed(1)} km)
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">Est. Driving Time</dt>
                        <dd className="text-right font-medium text-stone-900 tabular-nums">~{Math.round(distanceResult.timeMinutes ?? distanceResult.duration ?? 0)} mins</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">Selected Plan</dt>
                        <dd className="text-right font-medium text-stone-900">{selectedVehicle === "Family" ? "Family / MPV" : selectedVehicle}</dd>
                      </div>
                      {distanceResult.waitingTime > 0 && (
                        <div className="flex items-baseline justify-between gap-6 py-3">
                          <dt className="text-stone-600">
                            <span className="block">Stay / Waiting Charges</span>
                            <span className="mt-0.5 block text-xs text-stone-500">{stops.length} Stop(s) • Total Wait: {distanceResult.waitingTime} Mins</span>
                          </dt>
                          <dd className="text-right font-medium text-stone-900 tabular-nums">£{Number(distanceResult.waitingChargeAmount || 0).toFixed(2)}</dd>
                        </div>
                      )}
                      <div className="flex items-baseline justify-between gap-6 py-4">
                        <dt className="text-lg font-semibold text-stone-900">Estimated Fare</dt>
                        <dd className="text-right text-2xl font-semibold text-stone-900 tabular-nums">£{selectedPrice.toFixed(2)}</dd>
                      </div>
                    </dl>

                    <button
                      onClick={() => { setCurrentStep(2); }}
                      className="tl-btn tl-btn-primary w-full"
                    >
                      <span>Continue Booking Details</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: RIDE SCHEDULE & CONTACTS */}
            {currentStep === 2 && (
              <form onSubmit={handleReserveDetailsSubmit} className="space-y-8">
                {/* removed date and time fields */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    {distanceResult && (
                      <div className="border-l-2 border-brand-700 bg-brand-50 px-4 py-3 text-sm text-stone-800">
                        <div className="flex items-baseline justify-between gap-4 font-medium text-stone-900">
                          <span className="truncate">{distanceResult.pickupDisplay || pickupInput} → {distanceResult.dropoffDisplay || dropoffInput}</span>
                          <span className="shrink-0 font-semibold tabular-nums">£{selectedPrice.toFixed(2)}</span>
                        </div>
                        <div className="mt-1 text-xs text-stone-600">
                          {(distanceResult.distanceMiles ?? distanceResult.distance ?? 0).toFixed(1)} mi ({(distanceResult.distanceKm || (distanceResult.distanceMiles ?? distanceResult.distance ?? 0) * 1.60934).toFixed(1)} km) • ~{Math.round(distanceResult.timeMinutes ?? distanceResult.duration ?? 0)} mins • {selectedVehicle} Class
                        </div>
                      </div>
                    )}

                    <h3 className="tl-h3">Contact Information</h3>

                    <div className="space-y-5">
                      <label className="block">
                        <span className="tl-label">Passenger full name</span>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          className="tl-input"
                          required
                        />
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="block min-w-0">
                          <span className="tl-label">Passenger email</span>
                          <input
                            type="email"
                            placeholder="johndoe@example.com"
                            value={passengerEmail}
                            onChange={(e) => setPassengerEmail(e.target.value)}
                            className="tl-input"
                            required
                          />
                        </label>

                        <label className="block min-w-0">
                          <span className="tl-label">Mobile phone (WhatsApp ready)</span>
                          <input
                            type="tel"
                            placeholder="e.g. 0121 714 0876"
                            value={passengerPhone}
                            onChange={(e) => setPassengerPhone(e.target.value)}
                            className="tl-input"
                            required
                          />
                        </label>

                        <label className="block min-w-0">
                          <span className="tl-label">Alternate phone (optional)</span>
                          <input
                            type="tel"
                            placeholder="e.g. 0121 714 0876"
                            value={passengerAlternatePhone}
                            onChange={(e) => setPassengerAlternatePhone(e.target.value)}
                            className="tl-input"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 items-end gap-5">
                        <label className="block min-w-0">
                          <span className="tl-label">Passengers</span>
                          <select
                            value={passengerCount}
                            onChange={(e) => setPassengerCount(Number(e.target.value))}
                            className="tl-input"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>

                        <label className="block min-w-0">
                          <span className="tl-label">Bags / luggage</span>
                          <select
                            value={luggageCount}
                            onChange={(e) => setLuggageCount(Number(e.target.value))}
                            className="tl-input"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>

                        <label className="col-span-2 block min-w-0 sm:col-span-1">
                          <span className="tl-label">Flight no (optional)</span>
                          <input
                            type="text"
                            placeholder="e.g. EK37"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            className="tl-input"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="tl-btn tl-btn-outline sm:flex-1"
                  >
                    Back to Rates
                  </button>
                  <button
                    type="submit"
                    className="tl-btn tl-btn-primary sm:flex-1"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: INTEGRATED STRIPE / PAYPAL GATEWAY */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="space-y-8">
                  <div className="space-y-8">
                    <div className="border-b border-stone-200 pb-6">
                      <div className="flex items-end justify-between gap-6">
                        <h3 className="tl-h3">Secure Transaction Checkout</h3>
                        <div className="shrink-0 text-right">
                          <span className="block text-xs text-stone-500">Total Payable:</span>
                          <span className="text-2xl font-semibold text-stone-900 tabular-nums">£{finalPayablePrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Price breakdown when promo applied */}
                      {appliedPromo && (
                        <dl className="mt-5 divide-y divide-stone-200 border-t border-stone-200 text-sm">
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">Standard Fare:</dt>
                            <dd className="text-right text-stone-500 line-through tabular-nums">£{originalBasePrice.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">Promo Discount ({appliedPromo.code}):</dt>
                            <dd className="text-right font-medium text-brand-700 tabular-nums">-£{promoDiscountAmount.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 pt-3 text-lg font-semibold text-stone-900">
                            <dt>Final Amount:</dt>
                            <dd className="text-right tabular-nums">£{finalPayablePrice.toFixed(2)}</dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    {/* PROMO CODE INPUT BOX */}
                    <div className="space-y-3">
                      <div>
                        <label className="tl-label">
                          Have a coupon code or voucher?
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={e => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError("");
                            }}
                            placeholder="ENTER COUPON CODE (e.g. LUXURY10)"
                            disabled={!!appliedPromo || promoLoading}
                            aria-label="Coupon code"
                            className="tl-input min-w-0 uppercase tracking-wider placeholder:tracking-normal disabled:bg-stone-100 disabled:text-stone-500 sm:flex-1"
                          />
                          {appliedPromo ? (
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="tl-btn tl-btn-outline shrink-0"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleApplyPromoCode}
                              disabled={promoLoading || !promoInput.trim()}
                              className="tl-btn tl-btn-outline shrink-0"
                            >
                              {promoLoading ? (
                                <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                              ) : null}
                              <span>Apply</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Error or Success feedback */}
                      {promoError && (
                        <p role="alert" className="flex items-start gap-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                          <span>{promoError}</span>
                        </p>
                      )}
                      {promoSuccessMsg && (
                        <p role="status" className="flex items-start gap-3 border-l-2 border-brand-700 bg-brand-50 px-4 py-3 text-sm text-stone-800">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={1.5} />
                          <span>{promoSuccessMsg}</span>
                        </p>
                      )}
                    </div>

                    {/* Payment Tab selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Mollie")}
                        aria-pressed={paymentMethod === "Mollie"}
                        className={`tl-card flex h-12 cursor-pointer items-center gap-3 rounded-sm px-4 text-sm font-medium ${
                          paymentMethod === "Mollie"
                            ? "border-brand-700 ring-1 ring-brand-700 bg-brand-50/40 text-brand-800"
                            : "tl-card-hover text-stone-700"
                        }`}
                      >
                        <ShieldCheck className="w-5 h-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                        <span>Mollie Online</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Pay Later")}
                        aria-pressed={paymentMethod === "Pay Later"}
                        className={`tl-card flex h-12 cursor-pointer items-center gap-3 rounded-sm px-4 text-sm font-medium ${
                          paymentMethod === "Pay Later"
                            ? "border-brand-700 ring-1 ring-brand-700 bg-brand-50/40 text-brand-800"
                            : "tl-card-hover text-stone-700"
                        }`}
                      >
                        <Coins className="w-5 h-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                        <span>Pay Later / Cash</span>
                      </button>
                    </div>

                    {/* MOLLIE PAYMENT METHOD UI */}
                    {paymentMethod === "Mollie" ? (
                      <div className="space-y-6">
                        <div className="space-y-3 border-l-2 border-brand-700 bg-brand-50 px-4 py-4 text-stone-800">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-lg font-semibold tracking-wide text-stone-900">
                              mollie
                            </span>
                            <span className="border-l border-stone-300 pl-3 text-xs text-stone-600">
                              Official Gateway
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed text-stone-700">
                            Pay safely via <strong className="font-semibold text-stone-900">Mollie</strong> supporting <strong className="font-semibold text-stone-900">iDEAL, Visa, Mastercard, Bancontact, Klarna, Apple Pay &amp; PayPal</strong>.
                          </p>

                          {/* Supported payment badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-700">
                            <span className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">iDEAL</span>
                            <span className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">Visa / MC</span>
                            <span className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">Bancontact</span>
                            <span className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">Apple Pay</span>
                            <span className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">Klarna</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-stone-500">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.5} />
                          <span>Protected by Mollie 256-Bit SSL Bank Grade Encryption.</span>
                        </div>

                        <button
                          type="button"
                          onClick={handleMollieCheckout}
                          disabled={processingPayment}
                          className="tl-btn tl-btn-primary w-full"
                        >
                          {processingPayment ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Redirecting to Mollie Checkout...</span>
                            </>
                          ) : (
                            <span>Pay £{selectedPrice.toFixed(2)} with Mollie</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start gap-3 border-l-2 border-brand-700 bg-brand-50 px-4 py-4 text-stone-800">
                          <Coins className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                          <p className="text-sm leading-relaxed">
                            Secure your booking now and pay the driver directly in cash upon arrival.
                          </p>
                        </div>
                        <button
                          onClick={processCheckoutPayment}
                          className="tl-btn tl-btn-primary w-full"
                        >
                          Confirm Booking (Pay Later)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="tl-btn tl-btn-outline w-full"
                >
                  Back to schedule
                </button>
              </div>
            )}

            {/* STEP 4: RESERVATION SUCCESS */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="border-l-2 border-brand-700 bg-brand-50 px-5 py-5 text-stone-800">
                  <Check className="h-6 w-6 text-brand-700" strokeWidth={1.5} />

                  <div className="mt-3 space-y-2">
                    <h3 className="text-2xl font-semibold leading-snug text-stone-900">Chauffeur Reserved Successfully!</h3>
                    <p className="max-w-md text-base leading-relaxed text-stone-700">
                      Your luxury airport transfer is secured. A transaction receipt and chauffeur schedule has been dispatched.
                    </p>
                  </div>
                </div>

                {/* Booking receipt details summary */}
                <dl className="divide-y divide-stone-200 border-y border-stone-200 text-sm">
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Reservation ID:</dt>
                    <dd className="min-w-0 break-words text-right font-semibold text-brand-800 tabular-nums">{completedBookingId}</dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Passenger:</dt>
                    <dd className="min-w-0 break-words text-right text-stone-900">{passengerName}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Route:</dt>
                    <dd className="min-w-0 break-words text-right text-stone-900">{distanceResult?.pickupDisplay || pickupInput} → {distanceResult?.dropoffDisplay || dropoffInput}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Distance:</dt>
                    <dd className="min-w-0 text-right text-stone-900 tabular-nums">{(distanceResult?.distanceMiles ?? distanceResult?.distance ?? 0).toFixed(1)} mi ({(distanceResult?.distanceKm || (distanceResult?.distanceMiles ?? distanceResult?.distance ?? 0) * 1.60934).toFixed(1)} km)</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Date & Time:</dt>
                    <dd className="min-w-0 text-right text-stone-900 tabular-nums">{rideDate ? new Date(rideDate + "T12:00:00").toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ""} at {rideTime}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">Vehicle:</dt>
                    <dd className="min-w-0 text-right text-stone-900">{selectedVehicle} Class</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-4 text-lg font-semibold text-stone-900">
                    <dt className="shrink-0">Total Fare:</dt>
                    <dd className="min-w-0 text-right"><span className="tabular-nums">£{completedBookingPrice.toFixed(2)}</span> <span className="text-sm font-normal text-stone-600">({paymentMethod})</span></dd>
                  </div>
                </dl>

                {/* Immediate WhatsApp link */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/441217140876?text=Hi%20Travelluxx!%20My%20booking%20is%20submitted.%20ID:%20${completedBookingId}%20from%20${encodeURIComponent(distanceResult?.pickupDisplay || "")}%20to%2520${encodeURIComponent(distanceResult?.dropoffDisplay || "")}.%20Total%20Price:%20£${completedBookingPrice}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl-btn tl-btn-primary sm:flex-1"
                  >
                    <Phone className="w-5 h-5" strokeWidth={1.5} />
                    <span>Open dispatch in WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      // Reset State completely
                      setPickupInput("");
                      setDropoffInput("");
                      setDistanceResult(null);
                      setCurrentStep(1);
                      setSelectedVehicle(null);
                    }}
                    className="tl-btn tl-btn-outline sm:flex-1"
                  >
                    Calculate another route
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT BLOCK: INTERACTIVE LEAFLET VECTOR MAP (Colspan 5) */}
          <div className="lg:col-span-5 w-full flex flex-col self-start h-full">
            
            {/* Map wrapper container */}
            <div
              className="w-full h-[360px] sm:h-[420px] lg:h-[var(--map-height)] min-h-[350px] bg-stone-100 overflow-hidden border border-stone-200 relative flex flex-col"
              style={
                {
                  "--map-height": formHeight ? `${formHeight}px` : "100%",
                } as React.CSSProperties
              }
            >
              <GoogleBookingMap
                pickupCoords={customPickupCoords}
                dropoffCoords={customDropoffCoords}
                pickupInput={pickupInput}
                dropoffInput={dropoffInput}
                onMapClick={handleMapClick}
                onRouteCalculated={handleRouteCalculated}
              />
              
              {/* Overlay guides: Left */}
              <div className="absolute top-3 left-3 z-10 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700">
                <span>Interactive Route Mapping</span>
              </div>

              {/* Bottom-Left Map Legend Card matching the user's screenshot exactly */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-4 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-700"></span>
                  <span>Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 bg-stone-900"></span>
                  <span>Dropoff</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
