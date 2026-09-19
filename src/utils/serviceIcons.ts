import React from "react";
import {
  Plane,
  Car,
  Route,
  Briefcase,
  Users,
  Crown,
  UserCheck,
  Tag,
  Clock,
  MapPin,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  Star,
  Award,
  Compass,
  Navigation,
  Sparkles,
  PhoneCall,
  Luggage,
  Shield,
  Coffee,
  Key
} from "lucide-react";

export const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane,
  Car,
  Route,
  Briefcase,
  Users,
  Crown,
  UserCheck,
  Tag,
  Clock,
  MapPin,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  Star,
  Award,
  Compass,
  Navigation,
  Sparkles,
  PhoneCall,
  Luggage,
  Shield,
  Coffee,
  Key
};

export const AVAILABLE_SERVICE_ICONS = Object.keys(SERVICE_ICONS);

export function getServiceIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (iconName && SERVICE_ICONS[iconName]) {
    return SERVICE_ICONS[iconName];
  }
  return Car;
}

