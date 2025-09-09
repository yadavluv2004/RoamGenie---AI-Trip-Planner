import React from "react";

export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "🥂",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun loving adventurers",
    icon: "🏡",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekers",
    icon: "⛵",
    people: "5 to 10 People",
  },
];

function GroupSizeUi({ onSelectedOption }: { onSelectedOption: (value: string) => void }) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {SelectTravelersList.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center text-center p-4 border rounded-xl shadow-sm hover:shadow-md hover:border-primary transition cursor-pointer bg-white"
          onClick={() => onSelectedOption(item.title + ": " + item.people)}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-2xl">
            {item.icon}
          </div>
          <h2 className="text-sm font-semibold mt-3">{item.title}</h2>
          <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
          <p className="text-primary text-xs font-medium mt-2">{item.people}</p>
        </div>
      ))}
    </div>
  );
}




export default GroupSizeUi;

