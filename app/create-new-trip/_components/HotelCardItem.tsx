'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Hotel } from './ChatBox'
import { Star, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type Props = {
  hotel: Hotel;
};

function HotelCardItem({ hotel }: Props) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

  useEffect(() => {
    hotel && GetHotelImage();
  }, [hotel]);

  const GetHotelImage = async () => {
    try {
      const result = await axios.post("/api/google-place-detail", {
        placeName: hotel?.hotel_name,
        city: hotel?.hotel_address,
      });
      setPhotoUrl(result.data.image || "/placeholder.jpg");
    } catch (err) {
      console.error("Unsplash API error:", err);
      setPhotoUrl("/placeholder.jpg");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Image
          src={photoUrl}
          alt="place image"
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-xl shadow mb-2"
        />
        <h2 className="font-semibold text-lg">{hotel?.hotel_name}</h2>
        <h2 className="text-gray-500">{hotel?.hotel_address}</h2>
        <div className="flex justify-between items-center">
          <p className="flex gap-2 text-green-600 items-center">
            <Wallet className="w-4 h-4" />
            {hotel.price_per_night}
          </p>
          <p className="flex gap-2 text-yellow-500 items-center">
            <Star className="w-4 h-4" />
            {hotel.rating}
          </p>
        </div>
        <Link
          href={
            'https://www.google.com/maps/search/?api=1&query=' +
            hotel?.hotel_name
          }
          target="_blank"
        >
          <Button variant={"outline"} className="mt-1 w-full">
            View Detail
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default HotelCardItem
