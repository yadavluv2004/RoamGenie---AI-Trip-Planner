import { suggestions } from "@/app/_components/Hero";
import React from "react";

function EmptyBoxState({ onSelectOption }: { onSelectOption: (v: string) => void }) {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-3xl text-center">
        Start Planning New <strong className="text-primary">Trip</strong> using AI
      </h2>
      <p className="text-center text-gray-400 mt-2">
        Discover personalized travel itineraries, find the best destinations,
        and plan your dream vacation effortlessly with the power of AI.
        Let our smart assistant do the hard work while you enjoy the journey.
      </p>

      <div className="flex flex-col gap-2 mt-2">
        {suggestions.map((suggestion, index) => (
          <div
            onClick={() => onSelectOption(suggestion.title)}
            key={index}
            className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary cursor-pointer transition hover:text-primary"
          >
            {suggestion.icon}
            <h2 className="text-lg font-medium">{suggestion.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmptyBoxState;


