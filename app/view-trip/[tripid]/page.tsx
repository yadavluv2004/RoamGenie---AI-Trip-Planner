'use client'

import GlobalMap from '@/app/create-new-trip/_components/GlobalMap';
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function ViewTrip() {
  const { tripid } = useParams();
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [trip, setTrip] = useState<any>(null);
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  useEffect(() => {
    if (!userDetail?._id || !tripid) return;
    GetTrip();
  }, [userDetail, tripid]);

  const GetTrip = async () => {
    // Ensure tripid is a string
    const tripIdStr = Array.isArray(tripid) ? tripid[0] : tripid;
    if (!tripIdStr) return;

    try {
      const result = await convex.query(api.tripDetail.GetUserTripById, {
        uid: userDetail!._id,
        tripid: tripIdStr,
      });
      console.log(result);
      setTrip(result);
      setTripDetailInfo(result?.tripDetail);
    } catch (err) {
      console.error("Error fetching trip:", err);
    }
  };

  if (!trip) return <div>Loading...</div>;
  if (!tripid) return <div>Trip ID not found.</div>;

  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-3'>
        <Itinerary />
      </div>
      <div className='col-span-2'>
        <GlobalMap />
      </div>
    </div>
  );
}

export default ViewTrip;
