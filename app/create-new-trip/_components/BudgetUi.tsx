import React from "react";

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💵",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "💸",
    color: "bg-purple-100 text-purple-600",
  },
];

function BudgetUi({ onSelectedOption }: any) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {SelectBudgetOptions.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center text-center p-4 border rounded-xl shadow-sm hover:shadow-md hover:border-primary transition cursor-pointer bg-white"
          onClick={() => onSelectedOption(item.title + ": " + item.desc)}
        >
          {/* ✅ Apply dynamic color here */}
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full text-2xl ${item.color}`}
          >
            {item.icon}
          </div>
          <h2 className="text-sm font-semibold mt-3">{item.title}</h2>
          <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default BudgetUi;


