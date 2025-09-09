'use client'
import React, { useContext, useEffect, useState } from 'react';
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { TripInfo } from './create-new-trip/_components/ChatBox';

function Provider({ children }: { children: React.ReactNode }) {
  const createUser = useMutation(api.user.CreateNewUser);
  const { user } = useUser();

  const [userDetail, setUserDetail] = useState<any>();
  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);

  useEffect(() => {
    if (user) CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    if (user) {
      const result = await createUser({
        email: user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user?.imageUrl,
        name: user?.fullName ?? '',
      });
      setUserDetail(result);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
        <div>
          <Header />
          {children}
        </div>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;

// Hooks
export const useUserDetail = () => useContext(UserDetailContext);

export const useTripDetail = (): TripContextType => {
  const context = useContext(TripDetailContext);
  if (!context) {
    throw new Error("useTripDetail must be used within a TripProvider");
  }
  return context;
};
