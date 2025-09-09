'use client'
import { Button } from '@/components/ui/button'
import { Clock, ExternalLink, Ticket } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Activity } from './ChatBox'
import axios from 'axios'
type Props={
    activity:Activity
}
function PlaceCardItem({activity}:Props) {
    const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");
  
    useEffect(() => {
      activity && GetHotelImage();
    }, [activity]);
  
    const GetHotelImage = async () => {
      try {
        const result = await axios.post("/api/google-place-detail", {
          placeName: activity?.place_name+":"+activity?.place_address,
          
        });
        setPhotoUrl(result.data.image || "/placeholder.jpg");
      } catch (err) {
        console.error("Unsplash API error:", err);
        setPhotoUrl("/placeholder.jpg");
      }
    };
  return (
          <div
            
            className="rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
<Image
  src={photoUrl}              // ✅ use the fetched image
  width={400}
  height={200}
  alt={activity.place_name}
  className="w-full h-40 object-cover"
/>

            <h2 className="font-semibold text-lg">{activity?.place_name}</h2>
            <p className="text-gray-500 line-clamp-2">{activity?.place_details}</p>     
            <h2 className="flex gap-2 text-blue-500 line-clamp-1"><Ticket/>{activity?.ticket_pricing}</h2>
            <p className="flex text-orange-400 gap-2 line-clamp-1"><Clock/>{activity?.best_time_to_visit}</p>
            <Link href={'https://www.google.com/maps/search/?api=1&query='+activity?.place_name} target="_blank">
            <Button variant={'outline'} size={'sm'} className="w-full mt-2">View<ExternalLink/></Button>
          </Link>
          </div>
  )
}

export default PlaceCardItem
