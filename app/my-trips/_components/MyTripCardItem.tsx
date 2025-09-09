import React, { useEffect, useState } from 'react'
import {Trip} from '../page'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import axios from 'axios';
import Link from 'next/link';
type Props = {
  trip: Trip;
};

function MyTripCardItem({trip}:Props) {
        const [photoUrl, setPhotoUrl] = useState<string>();
      
        useEffect(() => {
          trip && GetHotelImage();
        }, [trip]);
      
        const GetHotelImage = async () => {
          try {
            const result = await axios.post("/api/google-place-detail", {
              placeName: trip?.tripDetail?.destination || ""
              
            });
            setPhotoUrl(result.data.image || "/placeholder.jpg");
          } catch (err) {
            console.error("Unsplash API error:", err);
            setPhotoUrl("/placeholder.jpg");
          }
        };
  return (
    
 <div 
  className="border rounded-2xl p-5 shadow-md flex flex-col gap-3"
>
<Link href={`/view-trip/${trip?.tripId}`} className="w-full h-64 relative overflow-hidden rounded-2xl">
  <Image
    src={photoUrl ? photoUrl : '/placeholder.jpg'}
    alt={trip.tripId}
    fill
    style={{ objectFit: 'cover' }}
    className="rounded-2xl"
  />
</Link>


  <h3 className="font-semibold text-xl flex gap-2">
    Destination: {trip.tripDetail.origin}<ArrowRight/>{trip.tripDetail.destination}
  </h3>
  <p>Duration: {trip.tripDetail.duration} days</p>
  <p>Group Size: {trip.tripDetail.group_size}</p>
  <p>Budget: {trip.tripDetail.budget}</p>
</div>

    
  )
}

export default MyTripCardItem
