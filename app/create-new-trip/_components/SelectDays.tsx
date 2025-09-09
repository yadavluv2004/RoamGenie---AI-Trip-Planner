import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function SelectDays({ onSelectedOption }: any) {
  const [days, setDays] = useState(3); // default value

  const increaseDays = () => {
    setDays((prev) => prev + 1);
  };

  const decreaseDays = () => {
    setDays((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const confirmSelection = () => {
    onSelectedOption(`Days: ${days}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white shadow-sm w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4">Select Trip Duration</h2>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseDays}
          className="rounded-full"
        >
          ➖
        </Button>

        <span className="text-xl font-bold w-12 text-center">{days}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={increaseDays}
          className="rounded-full"
        >
          ➕
        </Button>
      </div>

      <p className="text-gray-500 text-sm mt-3">
        {days} {days === 1 ? "Day" : "Days"}
      </p>

      <Button
        className="mt-4 w-full"
        onClick={confirmSelection}
      >
        Confirm
      </Button>
    </div>
  );
}

export default SelectDays;
