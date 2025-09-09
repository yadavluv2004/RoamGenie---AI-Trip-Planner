"use client";

import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./ChatBox";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function Itinerary() {
  const { tripDetailInfo,setTripDetailInfo } = useTripDetail(); // context
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  // Initialize tripData from context
  useEffect(() => {
    if (tripDetailInfo) {
      tripDetailInfo && setTripData(tripDetailInfo);
    }
  }, [tripDetailInfo]);

  // Prepare timeline items
  const data = tripData
    ? [
        {
          title: "Recommended Hotels",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData.hotels.map((hotel) => (
                <HotelCardItem key={hotel.hotel_name} hotel={hotel} />
              ))}
            </div>
          ),
        },
        ...tripData.itinerary.map((dayData) => ({
          title: `Day ${dayData.day}`,
          content: (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium">
                Best Time: {dayData.best_time_to_visit_day}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {dayData.activities.map((activity) => (
                  <PlaceCardItem
                    key={activity.place_name}
                    activity={activity}
                  />
                ))}
              </div>
            </div>
          ),
        })),
      ]
    : [];

  return (
    <div className="relative w-full h-[85vh] overflow-auto p-4">
      {tripData ? (
        <Timeline data={data} tripData={tripData} />
      ) : (
        <div>
            <h2 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-2xl md:text-3xl font-semibold flex items-center gap-2 bg-opacity-50 px-4 py-2 rounded-lg">
  <ArrowLeft className="w-8 h-8" />
  Getting to know you to build perfect trip here...
</h2>

          <Image
            src={"/travel.png"}
            width={600}
            height={500}
            className="w-full h-full object-cover rounded-3xl"
            alt="image"
          />

        </div>
      )}
    </div>
  );
}
