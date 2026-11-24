import React, { useState, useEffect } from "react";

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
    <section id="airports" className="tl-section bg-ivory">
      <div className="tl-container">

        {/* Section Heading */}
        <div>
          <span data-reveal className="tl-eyebrow">Coverage</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4 max-w-3xl">
            {settings?.homepage_airports_title || "We cover all major London airports"}
          </h2>
        </div>

        {/* Airport Taxi Row (6 columns): hairline grid. Every cell owns its white surface and
            its border, and overlaps its neighbours by 1px so the lines stay single hairlines;
            the container itself paints nothing, so nothing shows before the cells reveal. */}
        <ul data-reveal-group className="mt-12 grid grid-cols-2 pt-px pl-px sm:grid-cols-3 lg:grid-cols-6">
          {airports.map((airport) => (
            <li
              key={airport.code}
              className="-mt-px -ml-px border border-stone-200 bg-white px-5 py-7 sm:px-6 sm:py-8"
            >
              <div className="font-display text-3xl leading-none tracking-wide text-stone-900">
                {airport.code}
              </div>
              <div className="mt-4 text-sm font-medium text-stone-700">
                {airport.name}
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                Airport Taxi
              </div>
            </li>
          ))}
        </ul>

        {/* Service Cards Grid. Five equal columns on desktop (xl). In between, the five cards are
            arranged so no row is left with an empty slot and no column gets too narrow to read:
            tablet (sm) = one wide card then 2 + 2; small laptop / tablet landscape (lg) = 2 large + 3. */}
        <div data-reveal-group className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 xl:grid-cols-5">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className={`tl-card flex flex-col xl:col-span-1 ${
                idx === 0 ? "sm:col-span-2 lg:col-span-3" : idx === 1 ? "lg:col-span-3" : "lg:col-span-2"
              }`}
            >
              {/* Image box */}
              <div className={`aspect-[4/3] overflow-hidden bg-stone-100 ${idx === 0 ? "sm:max-lg:aspect-[2/1]" : ""}`}>
                <img
                  src={service.image}
                  alt={`${service.title} - Luxury Airport Transfer Solihull & London UK`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Text content */}
              <div className="flex-1 p-5 sm:p-6">
                <h3 className="tl-h3">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
