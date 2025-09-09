import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import React, { createContext } from "react";

export type TripContextType = {
  tripDetailInfo: TripInfo | null;
  setTripDetailInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>;
};

// Create context with default value undefined
export const TripDetailContext = createContext<TripContextType | undefined>(undefined);
