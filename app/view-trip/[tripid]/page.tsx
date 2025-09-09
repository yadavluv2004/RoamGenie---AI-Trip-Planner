'use client'
import GlobalMap from '@/app/create-new-trip/_components/GlobalMap';
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
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
//@ts-ignore
  const { tripDetailInfo,setTripDetailInfo } = useTripDetail(); // context

useEffect(() => {
  if (userDetail?._id && tripid) {
    GetTrip();
  }
}, [userDetail, tripid]);


  const GetTrip = async () => {
    try {
      const result = await convex.query(api.tripDetail.GetUserTripById, {
        uid: userDetail._id,
        tripid: tripid.toString(),
      });
      console.log(result);
      setTrip(result);
      setTripDetailInfo(result?.tripDetail);
    } catch (err) {
      console.error("Error fetching trip:", err);
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div className='grid grid-cols-5'>
      <div className='col-span-3'>
<Itinerary/>
      </div>
      <div className='col-span-2'>
        <GlobalMap/>
      </div>
    </div>
  );
}

export default ViewTrip;
