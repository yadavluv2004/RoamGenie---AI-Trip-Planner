"use client";

import { Button } from "@/components/ui/button";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUserDetail } from "../provider";
import { api } from "@/convex/_generated/api";
import { TripInfo } from "../create-new-trip/_components/ChatBox";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import MyTripCardItem from "./_components/MyTripCardItem";

export type Trip = {
  tripId: any;
  tripDetail: TripInfo;
  _id: string;
};

function MyTrips() {
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const { userDetail } = useUserDetail();

  useEffect(() => {
    if (userDetail?._id) {
      GetUserTrip();
    }
  }, [userDetail]);

  const GetUserTrip = async () => {
    if (!userDetail?._id) return;

    setLoading(true);
    try {
      const result = await convex.query(api.tripDetail.GetUserTrip, {
        uid: userDetail._id,
      });
      setMyTrips(result);
      console.log("Fetched trips:", result);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 p-10 md:px-24 lg:px-48">
      <h2 className="font-bold text-3xl">My Trips</h2>

      {loading && <p className="mt-5">Loading trips...</p>}

      {!loading && myTrips?.length === 0 && (
        <div className="p-7 border rounded-2xl flex flex-col items-center justify-center gap-5 mt-6">
          <h2>You don't have any trip plan created</h2>
          <Link href={"/create-new-trip"}>
            <Button>Create New Trip</Button>
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTrips?.map((trip,index) => (
<MyTripCardItem trip={trip} key={index}/>
        ))}
      </div>
    </div>
  );
}

export default MyTrips;

