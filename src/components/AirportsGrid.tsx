import React, { useState, useEffect } from "react";
import { Plane } from "lucide-react";

import airportTransfersImg from "../assets/images/transfer_airport_1786403518712.jpg";
import portTransfersImg from "../assets/images/transfer_port_1786403532912.jpg";
import stationTransfersImg from "../assets/images/transfer_station_1786403548164.jpg";
import popularCitiesImg from "../assets/images/transfer_city_1786403562698.jpg";
import businessTravelImg from "../assets/images/transfer_business_1786403576291.jpg";
import { getCustomImage } from "../utils/customImages";

interface AirportsGridProps {
  onSelectTransfer: (pickup: string, dropoff: string) => void;
  settings?: any;
}

export default function AirportsGrid({ onSelectTransfer, settings }: AirportsGridProps) {
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("custom_images_updated", handleUpdate);
    return () => window.removeEventListener("custom_images_updated", handleUpdate);
  }, []);

  const airports = [
    { name: settings?.airport_name_1 || "Heathrow", code: settings?.airport_code_1 || "LHR", fullName: `${settings?.airport_name_1 || "Heathrow"} Airport (${settings?.airport_code_1 || "LHR"})` },
    { name: settings?.airport_name_2 || "Gatwick", code: settings?.airport_code_2 || "LGW", fullName: `${settings?.airport_name_2 || "Gatwick"} Airport (${settings?.airport_code_2 || "LGW"})` },
    { name: settings?.airport_name_3 || "Luton", code: settings?.airport_code_3 || "LTN", fullName: `${settings?.airport_name_3 || "Luton"} Airport (${settings?.airport_code_3 || "LTN"})` },
    { name: settings?.airport_name_4 || "Stansted", code: settings?.airport_code_4 || "STN", fullName: `${settings?.airport_name_4 || "Stansted"} Airport (${settings?.airport_code_4 || "STN"})` },
    { name: settings?.airport_name_5 || "London City", code: settings?.airport_code_5 || "LCY", fullName: `${settings?.airport_name_5 || "London City"} Airport (${settings?.airport_code_5 || "LCY"})` },
    { name: settings?.airport_name_6 || "Southend", code: settings?.airport_code_6 || "SEN", fullName: `${settings?.airport_name_6 || "Southend"} Airport (${settings?.airport_code_6 || "SEN"})` }
  ];

  const services = [
    {
      id: "airport",
      title: settings?.service_title_1 || "Airport Transfers",
      description: settings?.service_desc_1 || "Reliable private transfers to Heathrow, Gatwick, and all major UK airports.",
      image: settings?.service_image_1 || getCustomImage("transfer_airport", airportTransfersImg),
      pickup: settings?.service_pickup_1 || "Shirley, Solihull B90",
      dropoff: settings?.service_dropoff_1 || "London Heathrow Airport (LHR)"
    },
    {
      id: "port",
      title: settings?.service_title_2 || "Port Transfers",
      description: settings?.service_desc_2 || "Reliable transfers to and from all major UK ports and cruise terminals.",
      image: settings?.service_image_2 || getCustomImage("transfer_port", portTransfersImg),
      pickup: settings?.service_pickup_2 || "Shirley, Solihull B90",
      dropoff: settings?.service_dropoff_2 || "Southampton Cruise Port"
    },
    {
      id: "station",
      title: settings?.service_title_3 || "Station Transfers",
      description: settings?.service_desc_3 || "Seamless transfers to and from rail stations across London and the UK.",
      image: settings?.service_image_3 || getCustomImage("transfer_station", stationTransfersImg),
      pickup: settings?.service_pickup_3 || "Shirley, Solihull B90",
      dropoff: settings?.service_dropoff_3 || "London Euston Station"
    },
    {
      id: "city",
      title: settings?.service_title_4 || "Popular Cities",
      description: settings?.service_desc_4 || "Travel to all major cities across the UK in comfort and style.",
      image: settings?.service_image_4 || getCustomImage("transfer_city", popularCitiesImg),
      pickup: settings?.service_pickup_4 || "Shirley, Solihull B90",
      dropoff: settings?.service_dropoff_4 || "London Central, UK"
    },
    {
      id: "business",
      title: settings?.service_title_5 || "Business Travel",
      description: settings?.service_desc_5 || "Executive travel solutions tailored for business and professionals.",
      image: settings?.service_image_5 || getCustomImage("transfer_business", businessTravelImg),
      pickup: settings?.service_pickup_5 || "Shirley, Solihull B90",
      dropoff: settings?.service_dropoff_5 || "Birmingham Airport (BHX)"
    }
  ];

  return (
    <section id="airports" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            {settings?.homepage_airports_title || "We cover all major London airports"}
          </h2>
        </div>

        {/* Airport Taxi Row (6 columns) */}
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-slate-200">
            {airports.map((airport, idx) => (
              <div
                key={airport.code}
                className={`py-8 px-4 text-center ${
                  idx >= 3 ? "sm:border-t-0" : ""
                }`}
              >
                <div className="mb-3 flex justify-center">
                  <Plane className="w-6 h-6 text-slate-700" />
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {airport.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Airport Taxi
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Cards Grid (5 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col"
            >
              {/* Image box */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
              </div>

              {/* Text content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
