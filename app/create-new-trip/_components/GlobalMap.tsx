'use client';

import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useTripDetail } from '@/app/provider';
import { Activity } from './ChatBox'; // Only need Activity type

function GlobalMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Keep map instance
  const { tripDetailInfo } = useTripDetail();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || '';

    // Create the map and store in ref
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 2,
      projection: 'globe',
    });

    const bounds = new mapboxgl.LngLatBounds();
    const markers: mapboxgl.Marker[] = [];

    // ✅ Use single itinerary object
    const itinerary = tripDetailInfo?.itinerary;
    if (itinerary?.activities) {
      itinerary.activities.forEach((activity: Activity) => {
        if (
          activity?.geo_coordinates &&
          typeof activity.geo_coordinates.longitude === 'number' &&
          typeof activity.geo_coordinates.latitude === 'number'
        ) {
          const marker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([
              activity.geo_coordinates.longitude,
              activity.geo_coordinates.latitude,
            ])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name))
            .addTo(mapRef.current!);

          markers.push(marker);

          const coordinates: [number, number] = [
            activity.geo_coordinates.longitude,
            activity.geo_coordinates.latitude,
          ];

          // Animate to each activity
          mapRef.current!.flyTo({
            center: coordinates,
            zoom: 8,
            essential: true,
          });

          bounds.extend(coordinates);
        }
      });
    }

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      markers.forEach((m) => m.remove());
      mapRef.current?.remove();
    };
  }, [tripDetailInfo]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '95%', height: '85vh', borderRadius: '20px' }}
    />
  );
}

export default GlobalMap;
