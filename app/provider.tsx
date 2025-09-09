'use client'
import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api'; // missing import
import { UserDetailContext } from '@/context/UserDetailContext';
import { CreateTripDetail } from '@/convex/tripDetail';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { TripInfo } from './create-new-trip/_components/ChatBox';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const createUser = useMutation(api.user.CreateNewUser);
  const { user } = useUser();
  const[userDetail,setUserDetail]=useState<any>();
  const [tripDetailInfo,setTripDetailInfo]=useState<TripInfo | null>(null);
  useEffect(()=>{
    user&&CreateNewUser();
  },[user])

  const CreateNewUser = async () => {
    // Save new User if Not Exist
    if (user) {
      const result = await createUser({
        email: user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user?.imageUrl ,
        name: user?.fullName ?? '',
        
      });
      setUserDetail(result);
    }
  }

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
   <TripDetailContext value={{tripDetailInfo,setTripDetailInfo}}>
    <div>
      <Header />
      {children}
    </div>
</TripDetailContext>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail=()=>{
  return useContext(UserDetailContext);
}

export const useTripDetail=():TripContextType | undefined=>{
  return useContext(TripDetailContext);
}