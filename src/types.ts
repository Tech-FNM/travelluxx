export interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  pickupCoords?: { lat: number; lng: number };
  dropoffCoords?: { lat: number; lng: number };
  distance: number;
  distanceMiles?: number;
  distanceKm?: number;
  duration: number;
  date: string;
  time: string;
  vehicle: "Economy" | "Luxury" | "Family";
  price: number;
  originalPrice?: number;
  promoCode?: string;
  discountAmount?: number;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  passengerAlternatePhone?: string;
  flightNumber: string;
  passengers: number;
  luggage: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid";
  createdAt: string;
  transactionId?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: "Unread" | "Read";
  createdAt: string;
}

export interface DistanceResult {
  distanceMiles: number;
  distanceKm?: number;
  distance?: number;
  duration?: number;
  durationText?: string;
  distanceText?: string;
  timeMinutes: number;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  routePoints: { lat: number; lng: number }[];
  instructions: (string | { text: string; distance: number; duration: number; type?: string; modifier?: string; name?: string })[];
  pickupDisplay: string;
  dropoffDisplay: string;
  prices: {
    Economy: number;
    Luxury: number;
    Family: number;
  };
  waitingTime?: number;
  waitingChargeAmount?: number;
  billableDistance?: number;
  source?: string;
}
