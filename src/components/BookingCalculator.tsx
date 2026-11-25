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
import { useContent } from "../content/useContent";

const MapLoading = () => {
  const c = useContent();
  return (
    <div className="w-full h-full min-h-[300px] bg-stone-100 flex items-center justify-center text-stone-500 text-sm">
      {c.t("booking_map_loading")}
    </div>
  );
};

const GoogleBookingMap = dynamic(() => import("./GoogleBookingMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

// Fills "{name}" placeholders in an editable message, e.g. fillText("Booking {id}", { id: "TL-1" }).
const fillText = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));

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

// Countries offered for the billing address (ISO codes, as Mollie expects them).
const BILLING_COUNTRIES: [string, string][] = [
  ["GB", "United Kingdom"], ["IE", "Ireland"], ["US", "United States"], ["CA", "Canada"], ["AU", "Australia"],
  ["FR", "France"], ["DE", "Germany"], ["ES", "Spain"], ["IT", "Italy"], ["NL", "Netherlands"], ["BE", "Belgium"],
  ["PT", "Portugal"], ["CH", "Switzerland"], ["AT", "Austria"], ["SE", "Sweden"], ["NO", "Norway"], ["DK", "Denmark"],
  ["PL", "Poland"], ["AE", "United Arab Emirates"], ["SA", "Saudi Arabia"], ["QA", "Qatar"], ["IN", "India"],
  ["PK", "Pakistan"], ["CN", "China"], ["JP", "Japan"], ["SG", "Singapore"], ["ZA", "South Africa"], ["NZ", "New Zealand"],
];

export default function BookingCalculator({ initialPickup = "", initialDropoff = "", settings }: BookingCalculatorProps) {
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  // Editable texts (dashboard > Site Content > Homepage > "Booking form – ...").
  const c = useContent(settings);
  // Effects that run once (the return from Mollie) read the latest texts through this ref.
  const contentRef = useRef(c);
  contentRef.current = c;
  // Step names shown in the progress stepper (same wording as the current-step caption).
  const STEP_LABELS = [c.t("booking_step1_name"), c.t("booking_step2_name"), c.t("booking_step3_name"), c.t("booking_step4_name")];
  // Display names of the vehicle classes; the values ("Economy", "Luxury", "Family") stay as they are.
  const vehicleLabel = (vehicle: string | null) =>
    vehicle === "Economy" ? c.t("booking_vehicle_economy")
      : vehicle === "Luxury" ? c.t("booking_vehicle_luxury")
      : vehicle === "Family" ? c.t("booking_vehicle_family")
      : vehicle;
  const dateAt = (date: string, time: string) => fillText(c.t("booking_date_time_text"), { date, time });
  const resolvingText = c.t("booking_msg_resolving_address");

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

  // Return journey: the same route driven back on its own date and time.
  const [tripType, setTripType] = useState<"oneway" | "return">("oneway");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");

  // Billing address: Mollie only offers Klarna when the payment carries one.
  const [billingStreet, setBillingStreet] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostcode, setBillingPostcode] = useState("");
  const [billingCountry, setBillingCountry] = useState("GB");
  const [billingError, setBillingError] = useState("");
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
  // The booking as the server stored it. After paying at Mollie the page reloads and the form is
  // empty, so the confirmation is drawn from this rather than from the form fields.
  const [completedBooking, setCompletedBooking] = useState<any>(null);
  const [paymentNotice, setPaymentNotice] = useState<{ kind: "failed" | "pending"; text: string } | null>(null);
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
      alert(c.t("booking_msg_geolocation_unsupported"));
      return;
    }
    
    setPickupInput(c.t("booking_msg_detecting_location"));
    
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
        setPickupInput(c.t("booking_msg_location_denied"));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const useMyDropoffLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert(c.t("booking_msg_geolocation_unsupported"));
      return;
    }
    
    setDropoffInput(c.t("booking_msg_detecting_location"));
    
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
        setDropoffInput(c.t("booking_msg_location_denied"));
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
    if (customPickupCoords && customDropoffCoords && pickupInput && dropoffInput && pickupInput !== resolvingText && dropoffInput !== resolvingText) {
      calculateDistance(pickupInput, dropoffInput);
    }
  }, [customPickupCoords, customDropoffCoords]);

  const handleMapClick = async (lat: number, lng: number) => {
    const currentMode = mapClickMode;
    
    if (currentMode === "pickup") {
      setPickupInput(resolvingText);
    } else {
      setDropoffInput(resolvingText);
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
          stops: stops.map(s => ({ address: s.address, duration: s.duration, waiting: s.waiting, lat: s.lat, lng: s.lng })),
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
      setErrorMsg(c.t("booking_msg_missing_locations"));
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
        setErrorMsg(c.t("booking_msg_address_not_found"));
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
        // Only the server's prices can be booked, so never show a price made up in the browser.
        setErrorMsg(c.t("booking_msg_quote_unavailable"));
      }
    } catch (err) {
      console.warn("Error calculating route:", err);
      setErrorMsg(c.t("booking_msg_quote_unavailable"));
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

  // Most journeys start at home, so the pick-up address is offered as the billing address (editable).
  // Airports, stations and hotels are never the customer's own address, so those are left blank.
  const prefillBillingAddress = () => {
    if (billingStreet || billingCity || billingPostcode) return;
    const pickupText = (distanceResult?.pickupDisplay || pickupInput || "").trim();
    if (!pickupText || /airport|station|terminal|hotel|\bport\b/i.test(pickupText)) return;
    const postcode = pickupText.match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/i);
    if (!postcode) return;
    const parts = pickupText.replace(/,?\s*(UK|United Kingdom)\s*$/i, "").split(",").map(part => part.trim()).filter(Boolean);
    if (parts.length < 2) return;
    const cityPart = parts[parts.length - 1].replace(postcode[0], "").trim() || parts[parts.length - 2];
    setBillingStreet(parts[0]);
    setBillingCity(cityPart.replace(postcode[0], "").trim());
    setBillingPostcode(postcode[0].toUpperCase());
  };

  // Bookings submission trigger
  const handleReserveDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rideDate || !rideTime || !passengerName || !passengerEmail || !passengerPhone || !selectedVehicle || !distanceResult) {
      alert(c.t("booking_msg_fill_all_fields"));
      return;
    }
    const datesError = journeyDatesError();
    if (datesError) {
      alert(datesError);
      return;
    }
    prefillBillingAddress();
    // Transition to payment checkout
    setCurrentStep(3);
  };

  // Promo Code validation & application
  const handleApplyPromoCode = async () => {
    const raw = promoInput.trim().toUpperCase();
    if (!raw) {
      setPromoError(c.t("booking_msg_promo_empty"));
      return;
    }
    const baseAmount = originalBasePrice;
    if (baseAmount <= 0) {
      setPromoError(c.t("booking_msg_promo_no_ride"));
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
        setPromoSuccessMsg(data.message || fillText(c.t("booking_msg_promo_applied"), { code: raw }));
      } else {
        setAppliedPromo(null);
        setPromoDiscountAmount(0);
        setPromoError(data.message || c.t("booking_msg_promo_invalid"));
      }
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoDiscountAmount(0);
      setPromoError(c.t("booking_msg_promo_connection"));
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
  const isReturn = tripType === "return";
  const oneWayPrice = distanceResult && selectedVehicle ? distanceResult.prices[selectedVehicle] : 0;
  // A return booking is two journeys over the same route, each at the one-way fare.
  const originalBasePrice = Math.round(oneWayPrice * (isReturn ? 2 : 1) * 100) / 100;

  // Checks the dates before moving on. Returns an error message, or "" when everything is in order.
  const journeyDatesError = () => {
    if (!rideDate || !rideTime) return c.t("booking_msg_date_missing");
    if (isReturn) {
      if (!returnDate || !returnTime) return c.t("booking_msg_return_date_missing");
      if (new Date(`${returnDate}T${returnTime}`).getTime() <= new Date(`${rideDate}T${rideTime}`).getTime()) {
        return c.t("booking_msg_return_before_outbound");
      }
    }
    return "";
  };

  const changeTripType = (next: "oneway" | "return") => {
    if (next === tripType) return;
    setTripType(next);
    setErrorMsg("");
    // A promo discount was worked out on the old total, so it has to be applied again.
    if (appliedPromo) handleRemovePromo();
  };

  const returnJourneyFields = isReturn
    ? { returnJourney: true, returnDate, returnTime, returnFlightNumber, outboundFare: oneWayPrice, returnFare: oneWayPrice }
    : { returnJourney: false };
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
      quoteToken: (distanceResult as any).quoteToken,
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
      ...returnJourneyFields,
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
        setCompletedBooking(data.booking);
        
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
        const failure = await res.json().catch(() => ({} as any));
        alert(failure?.error || c.t("booking_msg_booking_failed"));
      }
    } catch (err) {
      alert(c.t("booking_msg_payment_connection"));
    } finally {
      setProcessingPayment(false);
    }
  };

  // Back from Mollie: ask the server what actually happened to the payment.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingStatus = params.get("bookingStatus");
    const bookingId = params.get("bookingId");
    if (bookingStatus !== "success" || !bookingId) return;

    let cancelled = false;
    // The customer lands at the top of the page; bring the booking panel (and its message) into view.
    const showPanel = () =>
      window.setTimeout(() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    // Some methods take a few seconds to confirm, so a pending payment is asked about again.
    const check = async (attempt: number) => {
      try {
        const res = await fetch(`/api/mollie/status/${bookingId}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.success && data.paymentStatus === "Paid") {
          setCompletedBooking(data.booking || null);
          setCompletedBookingId(bookingId);
          setCompletedBookingPrice(Number(data.booking?.price || 0));
          setPaymentMethod("Mollie");
          setPaymentNotice(null);
          setCurrentStep(4);
          showPanel();
        } else if (data.success && data.paymentStatus === "Pending" && attempt < 5) {
          if (attempt === 1) showPanel();
          setPaymentNotice({ kind: "pending", text: fillText(contentRef.current.t("booking_msg_payment_confirming"), { id: bookingId }) });
          window.setTimeout(() => check(attempt + 1), 3000);
        } else if (data.success && data.paymentStatus === "Pending") {
          setPaymentNotice({ kind: "pending", text: fillText(contentRef.current.t("booking_msg_payment_not_confirmed"), { id: bookingId }) });
        } else {
          setPaymentNotice({ kind: "failed", text: contentRef.current.t("booking_msg_payment_failed") });
          showPanel();
        }
      } catch (err) {
        console.error("Failed to verify payment status:", err);
        if (!cancelled) {
          setPaymentNotice({ kind: "pending", text: fillText(contentRef.current.t("booking_msg_payment_check_failed"), { id: bookingId }) });
        }
      }
    };
    check(1);
    // Clean query params
    window.history.replaceState({}, "", window.location.pathname);
    return () => {
      cancelled = true;
    };
  }, []);

  // Mollie Payment Handler
  const handleMollieCheckout = async () => {
    if (!distanceResult || !selectedVehicle) return;
    if (!billingStreet.trim() || !billingCity.trim() || !billingPostcode.trim()) {
      setBillingError(c.t("booking_msg_billing_missing"));
      return;
    }
    if (billingCountry === "GB" && !/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(billingPostcode.trim())) {
      setBillingError(c.t("booking_msg_billing_postcode"));
      return;
    }
    setBillingError("");
    setProcessingPayment(true);

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
      quoteToken: (distanceResult as any).quoteToken,
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
      ...returnJourneyFields,
      billingAddress: {
        street: billingStreet.trim(),
        city: billingCity.trim(),
        postcode: billingPostcode.trim().toUpperCase(),
        country: billingCountry
      },
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
        alert(data.error || c.t("booking_msg_mollie_init_failed"));
      }
    } catch (err: any) {
      console.error("Mollie payment error:", err);
      alert(c.t("booking_msg_mollie_connection"));
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

  // What the confirmation shows: the booking as stored by the server when there is one (always the
  // case after returning from Mollie), otherwise the values still in the form.
  const receipt = {
    passengerName: completedBooking?.passengerName || passengerName,
    pickup: completedBooking?.pickup || distanceResult?.pickupDisplay || pickupInput,
    dropoff: completedBooking?.dropoff || distanceResult?.dropoffDisplay || dropoffInput,
    miles: Number(completedBooking?.distanceMiles ?? completedBooking?.distance ?? distanceResult?.distanceMiles ?? distanceResult?.distance ?? 0),
    date: completedBooking?.date || rideDate,
    time: completedBooking?.time || rideTime,
    vehicle: completedBooking?.vehicle || selectedVehicle,
    returnJourney: completedBooking ? Boolean(completedBooking.returnJourney) : isReturn,
    returnDate: completedBooking?.returnDate || returnDate,
    returnTime: completedBooking?.returnTime || returnTime,
  };
  const formatDate = (value: string) =>
    value ? new Date(value + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <section id="calculator" className="tl-section bg-ivory text-stone-700 relative">
      <div className="tl-container">

        {/* Section Header */}
        <div className="mb-12 lg:mb-14">
          <span data-reveal className="tl-eyebrow">{c.t("booking_eyebrow")}</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4">
            {c.t("booking_title")}
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
            {c.t("booking_lead")}
          </p>
        </div>

        {/* Outer Split Panel Card */}
        <div data-reveal="fade" className="tl-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-12 lg:gap-y-10 rounded-sm p-6 sm:p-10 relative items-stretch">

          {/* STEPPER METADATA SUBBAR */}
          <div className="lg:col-span-12 min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="text-sm text-stone-500">{c.t("booking_progress_label")}</span>
              <div className="text-sm font-medium text-brand-800 lg:hidden">
                {`${currentStep}. ${STEP_LABELS[currentStep - 1]}`}
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

                {paymentNotice && (
                  <div
                    role={paymentNotice.kind === "failed" ? "alert" : "status"}
                    className={`flex items-start gap-3 border-l-2 px-4 py-4 text-sm leading-relaxed ${
                      paymentNotice.kind === "failed" ? "border-red-600 bg-red-50 text-red-700" : "border-brand-700 bg-brand-50 text-stone-800"
                    }`}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>{paymentNotice.text}</span>
                  </div>
                )}

                {/* Inputs card */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="tl-h3">{c.t("booking_route_heading")}</h3>

                    <div className="space-y-5">
                      <div className="relative" ref={pickupRef}>
                        <label className="block">
                          <span className="tl-label">{c.t("booking_pickup_label")}</span>
                          <span className="relative block">
                            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-stone-400">P</span>
                            <input
                              type="text"
                              placeholder={c.t("booking_pickup_placeholder")}
                              value={pickupInput}
                              onChange={(e) => {
                                handleInput(e.target.value, 'pickup');
                              }}
                              onFocus={() => handleInput(pickupInput, 'pickup', false)}
                              className="tl-input pl-11 pr-12 text-ellipsis"
                            />
                          </span>
                        </label>
                        <button type="button" onClick={useMyLocation} aria-label={c.t("booking_pickup_locate_label")} className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center text-stone-400 transition-colors duration-200 hover:text-brand-700"><Compass className="w-5 h-5" strokeWidth={1.5} /></button>
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
                          <span className="tl-label">{c.t("booking_dropoff_label")}</span>
                          <span className="relative block">
                            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-stone-400">D</span>
                            <input
                              type="text"
                              placeholder={c.t("booking_dropoff_placeholder")}
                              value={dropoffInput}
                              onChange={(e) => {
                                handleInput(e.target.value, 'dropoff');
                              }}
                              onFocus={() => handleInput(dropoffInput, 'dropoff', false)}
                              className="tl-input pl-11 pr-12 text-ellipsis"
                            />
                          </span>
                        </label>
                        <button type="button" onClick={useMyDropoffLocation} aria-label={c.t("booking_dropoff_locate_label")} className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center text-stone-400 transition-colors duration-200 hover:text-brand-700"><Compass className="w-5 h-5" strokeWidth={1.5} /></button>
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
                      <span>{c.t("booking_route_help")}</span>
                    </div>

                    {errorMsg && !distanceResult && (
                      <div role="alert" className="flex items-start gap-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-5">
                      <label className="block min-w-0 flex-1">
                        <span className="tl-label">{c.t("booking_date_label")}</span>
                        <span className="relative block">
                          <Calendar aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                          <input
                            type="date"
                            value={rideDate}
                            onChange={(e) => { setRideDate(e.target.value); setErrorMsg(""); }}
                            className="tl-input pl-11"
                          />
                        </span>
                      </label>
                      <label className="block min-w-0 flex-1">
                        <span className="tl-label">{c.t("booking_time_label")}</span>
                        <span className="relative block">
                          <Clock aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                          <input
                            type="time"
                            value={rideTime}
                            onChange={(e) => { setRideTime(e.target.value); setErrorMsg(""); }}
                            className="tl-input pl-11"
                          />
                        </span>
                      </label>
                    </div>

                    {/* One way or return */}
                    <div role="group" aria-label={c.t("booking_journey_type_label")}>
                      <span className="tl-label">{c.t("booking_journey_type_label")}</span>
                      <div className="grid grid-cols-2 gap-3">
                        {([["oneway", c.t("booking_oneway_label")], ["return", c.t("booking_return_label")]] as const).map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => changeTripType(value)}
                            aria-pressed={tripType === value}
                            className={`tl-card flex h-12 cursor-pointer items-center justify-center rounded-sm px-4 text-sm font-medium ${
                              tripType === value
                                ? "border-brand-700 ring-1 ring-brand-700 bg-brand-50/40 text-brand-800"
                                : "tl-card-hover text-stone-700"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isReturn && (
                      <div className="space-y-4 border-l-2 border-brand-700 bg-brand-50/60 px-4 py-4">
                        <p className="text-sm leading-relaxed text-stone-700">
                          {c.t("booking_return_intro")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5">
                          <label className="block min-w-0 flex-1">
                            <span className="tl-label">{c.t("booking_return_date_label")}</span>
                            <span className="relative block">
                              <Calendar aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                              <input
                                type="date"
                                value={returnDate}
                                min={rideDate || undefined}
                                onChange={(e) => { setReturnDate(e.target.value); setErrorMsg(""); }}
                                className="tl-input pl-11"
                              />
                            </span>
                          </label>
                          <label className="block min-w-0 flex-1">
                            <span className="tl-label">{c.t("booking_return_time_label")}</span>
                            <span className="relative block">
                              <Clock aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-stone-400" strokeWidth={1.5} />
                              <input
                                type="time"
                                value={returnTime}
                                onChange={(e) => { setReturnTime(e.target.value); setErrorMsg(""); }}
                                className="tl-input pl-11"
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div role="group" aria-label={c.t("booking_vehicle_label")}>
                      <span className="tl-label">{c.t("booking_vehicle_label")}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Economy", "Luxury", "Family"].map((vehicle) => {
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
                                {vehicleLabel(vehicle)}
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
                          <span>{c.t("booking_calculating_text")}</span>
                        </>
                      ) : (
                        <>
                          <span>{c.t("booking_calculate_button")}</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearRoute}
                      className="tl-btn tl-btn-outline w-12 shrink-0 px-0 text-stone-600"
                      title={c.t("booking_clear_route_label")}
                      aria-label={c.t("booking_clear_route_label")}
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>

                </div>

                {/* Pricing display panels shown first */}
                {distanceResult && (
                  <div className="space-y-6 border-t border-stone-200 pt-8">
                    <h4 className="tl-h3">{c.t("booking_summary_heading")}</h4>

                    <dl className="divide-y divide-stone-200 border-y border-stone-200 text-sm">
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">{c.t("booking_summary_distance")}</dt>
                        <dd className="text-right font-medium text-stone-900 tabular-nums">
                          {(distanceResult.distanceMiles ?? distanceResult.distance ?? 0).toFixed(1)} mi
                          <span className="ml-1 font-normal text-stone-500">
                            ({(distanceResult.distanceKm || (distanceResult.distanceMiles ?? distanceResult.distance ?? 0) * 1.60934).toFixed(1)} km)
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">{c.t("booking_summary_time")}</dt>
                        <dd className="text-right font-medium text-stone-900 tabular-nums">~{Math.round(distanceResult.timeMinutes ?? distanceResult.duration ?? 0)} {c.t("booking_summary_minutes")}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="text-stone-600">{c.t("booking_summary_plan")}</dt>
                        <dd className="text-right font-medium text-stone-900">{vehicleLabel(selectedVehicle)}</dd>
                      </div>
                      {distanceResult.waitingTime > 0 && (
                        <div className="flex items-baseline justify-between gap-6 py-3">
                          <dt className="text-stone-600">
                            <span className="block">{c.t("booking_summary_waiting")}</span>
                            <span className="mt-0.5 block text-xs text-stone-500">{fillText(c.t("booking_summary_waiting_detail"), { stops: stops.length, minutes: distanceResult.waitingTime })}</span>
                          </dt>
                          <dd className="text-right font-medium text-stone-900 tabular-nums">£{Number(distanceResult.waitingChargeAmount || 0).toFixed(2)}</dd>
                        </div>
                      )}
                      {isReturn && (
                        <>
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">{c.t("booking_summary_outbound")}</dt>
                            <dd className="text-right font-medium text-stone-900 tabular-nums">£{oneWayPrice.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">
                              <span className="block">{c.t("booking_summary_return")}</span>
                              {returnDate && returnTime && (
                                <span className="mt-0.5 block text-xs text-stone-500">{dateAt(formatDate(returnDate), returnTime)}</span>
                              )}
                            </dt>
                            <dd className="text-right font-medium text-stone-900 tabular-nums">£{oneWayPrice.toFixed(2)}</dd>
                          </div>
                        </>
                      )}
                      <div className="flex items-baseline justify-between gap-6 py-4">
                        <dt className="text-lg font-semibold text-stone-900">{isReturn ? c.t("booking_summary_fare_return") : c.t("booking_summary_fare")}</dt>
                        <dd className="text-right text-2xl font-semibold text-stone-900 tabular-nums">£{selectedPrice.toFixed(2)}</dd>
                      </div>
                    </dl>

                    {errorMsg && (
                      <div role="alert" className="flex items-start gap-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        const datesError = journeyDatesError();
                        if (datesError) {
                          setErrorMsg(datesError);
                          return;
                        }
                        setErrorMsg("");
                        setCurrentStep(2);
                      }}
                      className="tl-btn tl-btn-primary w-full"
                    >
                      <span>{c.t("booking_continue_button")}</span>
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
                          {(distanceResult.distanceMiles ?? distanceResult.distance ?? 0).toFixed(1)} mi ({(distanceResult.distanceKm || (distanceResult.distanceMiles ?? distanceResult.distance ?? 0) * 1.60934).toFixed(1)} km) • ~{Math.round(distanceResult.timeMinutes ?? distanceResult.duration ?? 0)} mins • {fillText(c.t("booking_vehicle_class_text"), { vehicle: selectedVehicle ?? "" })}
                        </div>
                        <div className="mt-2 space-y-0.5 text-xs text-stone-700">
                          <div>{isReturn ? `${c.t("booking_details_outbound_prefix")} ` : ""}{dateAt(formatDate(rideDate), rideTime)}</div>
                          {isReturn && <div>{c.t("booking_details_return_prefix")} {dateAt(formatDate(returnDate), returnTime)}</div>}
                        </div>
                      </div>
                    )}

                    <h3 className="tl-h3">{c.t("booking_details_heading")}</h3>

                    <div className="space-y-5">
                      <label className="block">
                        <span className="tl-label">{c.t("booking_name_label")}</span>
                        <input
                          type="text"
                          placeholder={c.t("booking_name_placeholder")}
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          className="tl-input"
                          required
                        />
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <label className="block min-w-0">
                          <span className="tl-label">{c.t("booking_email_label")}</span>
                          <input
                            type="email"
                            placeholder={c.t("booking_email_placeholder")}
                            value={passengerEmail}
                            onChange={(e) => setPassengerEmail(e.target.value)}
                            className="tl-input"
                            required
                          />
                        </label>

                        <label className="block min-w-0">
                          <span className="tl-label">{c.t("booking_phone_label")}</span>
                          <input
                            type="tel"
                            placeholder={c.t("booking_phone_placeholder")}
                            value={passengerPhone}
                            onChange={(e) => setPassengerPhone(e.target.value)}
                            className="tl-input"
                            required
                          />
                        </label>

                        <label className="block min-w-0">
                          <span className="tl-label">{c.t("booking_alt_phone_label")}</span>
                          <input
                            type="tel"
                            placeholder={c.t("booking_alt_phone_placeholder")}
                            value={passengerAlternatePhone}
                            onChange={(e) => setPassengerAlternatePhone(e.target.value)}
                            className="tl-input"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 items-end gap-5">
                        <label className="block min-w-0">
                          <span className="tl-label">{c.t("booking_passengers_label")}</span>
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
                          <span className="tl-label">{c.t("booking_luggage_label")}</span>
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
                          <span className="tl-label">{c.t("booking_flight_label")}</span>
                          <input
                            type="text"
                            placeholder={c.t("booking_flight_placeholder")}
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            className="tl-input"
                          />
                        </label>

                        {isReturn && (
                          <label className="col-span-2 block min-w-0 sm:col-span-3">
                            <span className="tl-label">{c.t("booking_return_flight_label")}</span>
                            <input
                              type="text"
                              placeholder={c.t("booking_return_flight_placeholder")}
                              value={returnFlightNumber}
                              onChange={(e) => setReturnFlightNumber(e.target.value)}
                              className="tl-input"
                            />
                          </label>
                        )}
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
                    {c.t("booking_back_to_rates")}
                  </button>
                  <button
                    type="submit"
                    className="tl-btn tl-btn-primary sm:flex-1"
                  >
                    {c.t("booking_proceed_payment")}
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
                        <h3 className="tl-h3">{c.t("booking_checkout_heading")}</h3>
                        <div className="shrink-0 text-right">
                          <span className="block text-xs text-stone-500">{c.t("booking_total_payable")}</span>
                          <span className="text-2xl font-semibold text-stone-900 tabular-nums">£{finalPayablePrice.toFixed(2)}</span>
                        </div>
                      </div>

                      {isReturn && (
                        <dl className="mt-5 divide-y divide-stone-200 border-t border-stone-200 text-sm">
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">{c.t("booking_checkout_outbound")}, {dateAt(formatDate(rideDate), rideTime)}</dt>
                            <dd className="text-right text-stone-900 tabular-nums">£{oneWayPrice.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">{c.t("booking_checkout_return")}, {dateAt(formatDate(returnDate), returnTime)}</dt>
                            <dd className="text-right text-stone-900 tabular-nums">£{oneWayPrice.toFixed(2)}</dd>
                          </div>
                        </dl>
                      )}

                      {/* Price breakdown when promo applied */}
                      {appliedPromo && (
                        <dl className="mt-5 divide-y divide-stone-200 border-t border-stone-200 text-sm">
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">{c.t("booking_promo_standard")}</dt>
                            <dd className="text-right text-stone-500 line-through tabular-nums">£{originalBasePrice.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 py-3">
                            <dt className="text-stone-600">{c.t("booking_promo_discount")} ({appliedPromo.code}):</dt>
                            <dd className="text-right font-medium text-brand-700 tabular-nums">-£{promoDiscountAmount.toFixed(2)}</dd>
                          </div>
                          <div className="flex items-baseline justify-between gap-6 pt-3 text-lg font-semibold text-stone-900">
                            <dt>{c.t("booking_promo_final")}</dt>
                            <dd className="text-right tabular-nums">£{finalPayablePrice.toFixed(2)}</dd>
                          </div>
                        </dl>
                      )}
                    </div>

                    {/* PROMO CODE INPUT BOX */}
                    <div className="space-y-3">
                      <div>
                        <label className="tl-label">
                          {c.t("booking_promo_label")}
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={e => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError("");
                            }}
                            placeholder={c.t("booking_promo_placeholder")}
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
                              {c.t("booking_promo_remove")}
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
                              <span>{c.t("booking_promo_apply")}</span>
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
                        <span>{c.t("booking_pay_online_option")}</span>
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
                        <span>{c.t("booking_pay_later_option")}</span>
                      </button>
                    </div>

                    {/* MOLLIE PAYMENT METHOD UI */}
                    {paymentMethod === "Mollie" ? (
                      <div className="space-y-6">
                        <div className="space-y-3 border-l-2 border-brand-700 bg-brand-50 px-4 py-4 text-stone-800">
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-lg font-semibold tracking-wide text-stone-900">
                              {c.t("booking_mollie_name")}
                            </span>
                            <span className="border-l border-stone-300 pl-3 text-xs text-stone-600">
                              {c.t("booking_mollie_badge")}
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed text-stone-700">
                            {c.t("booking_mollie_text_before")} <strong className="font-semibold text-stone-900">{c.t("booking_mollie_text_provider")}</strong> {c.t("booking_mollie_text_middle")} <strong className="font-semibold text-stone-900">{c.t("booking_mollie_text_methods")}</strong>.
                          </p>

                          {/* Supported payment badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-700">
                            {c.lines("booking_mollie_methods").map((method, index) => (
                              <span key={index} className="rounded-sm border border-stone-200 bg-white px-2.5 py-1">{method}</span>
                            ))}
                          </div>
                        </div>

                        {/* Billing address: required by Klarna and used for card checks */}
                        <fieldset className="space-y-5">
                          <legend className="tl-h3">{c.t("booking_billing_heading")}</legend>
                          <p className="text-sm leading-relaxed text-stone-500">
                            {c.t("booking_billing_intro")}
                          </p>
                          <label className="block">
                            <span className="tl-label">{c.t("booking_billing_street_label")}</span>
                            <input
                              type="text"
                              autoComplete="billing address-line1"
                              placeholder={c.t("booking_billing_street_placeholder")}
                              value={billingStreet}
                              onChange={(e) => { setBillingStreet(e.target.value); setBillingError(""); }}
                              className="tl-input"
                            />
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <label className="block min-w-0">
                              <span className="tl-label">{c.t("booking_billing_city_label")}</span>
                              <input
                                type="text"
                                autoComplete="billing address-level2"
                                placeholder={c.t("booking_billing_city_placeholder")}
                                value={billingCity}
                                onChange={(e) => { setBillingCity(e.target.value); setBillingError(""); }}
                                className="tl-input"
                              />
                            </label>
                            <label className="block min-w-0">
                              <span className="tl-label">{c.t("booking_billing_postcode_label")}</span>
                              <input
                                type="text"
                                autoComplete="billing postal-code"
                                placeholder={c.t("booking_billing_postcode_placeholder")}
                                value={billingPostcode}
                                onChange={(e) => { setBillingPostcode(e.target.value.toUpperCase()); setBillingError(""); }}
                                className="tl-input uppercase placeholder:normal-case"
                              />
                            </label>
                            <label className="block min-w-0">
                              <span className="tl-label">{c.t("booking_billing_country_label")}</span>
                              <select
                                autoComplete="billing country"
                                value={billingCountry}
                                onChange={(e) => { setBillingCountry(e.target.value); setBillingError(""); }}
                                className="tl-input"
                              >
                                {BILLING_COUNTRIES.map(([code, name]) => (
                                  <option key={code} value={code}>{name}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          {billingError && (
                            <p role="alert" className="flex items-start gap-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                              <span>{billingError}</span>
                            </p>
                          )}
                        </fieldset>

                        <div className="flex items-start gap-2 text-sm text-stone-500">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" strokeWidth={1.5} />
                          <span>{c.t("booking_mollie_security_note")}</span>
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
                              <span>{c.t("booking_mollie_redirecting")}</span>
                            </>
                          ) : (
                            <span>{fillText(c.t("booking_mollie_pay_button"), { price: selectedPrice.toFixed(2) })}</span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start gap-3 border-l-2 border-brand-700 bg-brand-50 px-4 py-4 text-stone-800">
                          <Coins className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.5} />
                          <p className="text-sm leading-relaxed">
                            {c.t("booking_pay_later_text")}
                          </p>
                        </div>
                        <button
                          onClick={processCheckoutPayment}
                          className="tl-btn tl-btn-primary w-full"
                        >
                          {c.t("booking_pay_later_button")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="tl-btn tl-btn-outline w-full"
                >
                  {c.t("booking_back_to_schedule")}
                </button>
              </div>
            )}

            {/* STEP 4: RESERVATION SUCCESS */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="border-l-2 border-brand-700 bg-brand-50 px-5 py-5 text-stone-800">
                  <Check className="h-6 w-6 text-brand-700" strokeWidth={1.5} />

                  <div className="mt-3 space-y-2">
                    <h3 className="text-2xl font-semibold leading-snug text-stone-900">{c.t("booking_confirm_heading")}</h3>
                    <p className="max-w-md text-base leading-relaxed text-stone-700">
                      {c.t("booking_confirm_text")}
                    </p>
                  </div>
                </div>

                {/* Booking receipt details summary */}
                <dl className="divide-y divide-stone-200 border-y border-stone-200 text-sm">
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_id")}</dt>
                    <dd className="min-w-0 break-words text-right font-semibold text-brand-800 tabular-nums">{completedBookingId}</dd>
                  </div>

                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_passenger")}</dt>
                    <dd className="min-w-0 break-words text-right text-stone-900">{receipt.passengerName}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_route")}</dt>
                    <dd className="min-w-0 break-words text-right text-stone-900">{receipt.pickup} → {receipt.dropoff}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_distance")}</dt>
                    <dd className="min-w-0 text-right text-stone-900 tabular-nums">{receipt.miles.toFixed(1)} mi ({(receipt.miles * 1.60934).toFixed(1)} km){receipt.returnJourney ? ` ${c.t("booking_receipt_each_way")}` : ""}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{receipt.returnJourney ? c.t("booking_receipt_outbound") : c.t("booking_receipt_date")}</dt>
                    <dd className="min-w-0 text-right text-stone-900 tabular-nums">{dateAt(formatDate(receipt.date), receipt.time)}</dd>
                  </div>
                  {receipt.returnJourney && (
                    <div className="flex items-baseline justify-between gap-6 py-3">
                      <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_return")}</dt>
                      <dd className="min-w-0 text-right text-stone-900 tabular-nums">{dateAt(formatDate(receipt.returnDate), receipt.returnTime)}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="shrink-0 text-stone-600">{c.t("booking_receipt_vehicle")}</dt>
                    <dd className="min-w-0 text-right text-stone-900">{fillText(c.t("booking_vehicle_class_text"), { vehicle: receipt.vehicle ?? "" })}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-6 py-4 text-lg font-semibold text-stone-900">
                    <dt className="shrink-0">{c.t("booking_receipt_total")}</dt>
                    <dd className="min-w-0 text-right"><span className="tabular-nums">£{completedBookingPrice.toFixed(2)}</span> <span className="text-sm font-normal text-stone-600">({paymentMethod})</span></dd>
                  </div>
                </dl>

                {/* Immediate WhatsApp link */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://wa.me/${String(whatsappNum).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(fillText(c.t("booking_whatsapp_message"), {
                      id: completedBookingId,
                      pickup: receipt.pickup || "",
                      dropoff: receipt.dropoff || "",
                      price: completedBookingPrice,
                    }))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl-btn tl-btn-primary sm:flex-1"
                  >
                    <Phone className="w-5 h-5" strokeWidth={1.5} />
                    <span>{c.t("booking_whatsapp_button")}</span>
                  </a>

                  <button
                    onClick={() => {
                      // Reset State completely
                      setPickupInput("");
                      setDropoffInput("");
                      setDistanceResult(null);
                      setCurrentStep(1);
                      setSelectedVehicle(null);
                      setCompletedBooking(null);
                      setPaymentNotice(null);
                      setTripType("oneway");
                      setReturnDate("");
                      setReturnTime("");
                      setReturnFlightNumber("");
                    }}
                    className="tl-btn tl-btn-outline sm:flex-1"
                  >
                    {c.t("booking_new_route_button")}
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
                <span>{c.t("booking_map_badge")}</span>
              </div>

              {/* Bottom-Left Map Legend Card matching the user's screenshot exactly */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-4 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-700"></span>
                  <span>{c.t("booking_map_legend_pickup")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 bg-stone-900"></span>
                  <span>{c.t("booking_map_legend_dropoff")}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
