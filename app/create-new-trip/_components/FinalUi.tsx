"use client";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

type FinalUiProps = {
  viewTrip: () => void;
  disable?: boolean;
};

function FinalUi({ viewTrip, disable }: any) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-2xl shadow-md">
      <Globe2 className="text-primary text-4xl animate-bounce" />

      <h2 className="mt-3 text-lg font-semibold text-primary">
        ✈️ Planning your dream trip...
      </h2>

      <p className="text-gray-500 text-sm text-center mt-1">
        Gathering best destinations, activities, and travel details for you.
      </p>

      <Button disabled={!disable} onClick={viewTrip} className="mt-4 px-6 py-2">
        View Trip
      </Button>
    </div>
  );
}

export default FinalUi;
