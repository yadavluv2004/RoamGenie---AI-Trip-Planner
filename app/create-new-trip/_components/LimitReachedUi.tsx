"use client";
import React from "react";
import { AlertCircle } from "lucide-react";

type LimitReachedUiProps = {
  onUpgrade?: () => void;
};

export default function LimitReachedUi({ onUpgrade }: LimitReachedUiProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-100 rounded-xl mt-4">
      <AlertCircle className="text-red-500 text-4xl mb-2" />
      <h2 className="text-red-700 font-semibold text-lg mb-2">
        Daily Limit Reached
      </h2>
      <p className="text-red-600 text-sm text-center mb-4">
        You have reached your daily request limit. Please try again tomorrow or upgrade your plan.
      </p>
      {onUpgrade && (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onUpgrade}
        >
          Upgrade Plan
        </button>
      )}
    </div>
  );
}
