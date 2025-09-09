"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowDown, Globe2, Landmark, Plane, Send } from "lucide-react";
import HeroVideoDialog from "../../components/magicui/hero-video-dialog";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const suggestions = [
  {
    title: "Explore Destinations",
    icon: <Globe2 className="text-blue-400 h-5 w-5 " />,
  },
  {
    title: "Book a Flight",
    icon: <Plane className="text-green-500 h-5 w-5" />,
  },
  {
    title: "Visit Landmarks",
    icon: <Landmark className="text-orange-500 h-5 w-5" />,
  },
  {
    title: "Discover Cultures",
    icon: <Globe2 className="text-yellow-600 h-5 w-5" />,
  },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    // Add your trip planning logic here
    router.push('/create-new-trip')
  };

  return (
    <div className="mt-24 w-full flex justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        {/* Title */}
        <h1 className="text-xl md:text-5xl font-bold">
          Hey, I'm your personal <span className="text-primary">Trip Planner</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg">
          Tell me what you want, and I'll handle the rest: Flights, Hotels, Trip Planner – all in seconds.
        </p>

        {/* Input Box */}
        <div>
          <div className="border rounded-2xl p-4 relative">
            <Textarea
              placeholder="Create a trip from Paris to New York"
              className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            />
            <Button size="icon" className="absolute bottom-6 right-6" onClick={()=> onSend()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Suggestion List */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-xl hover:bg-primary cursor-pointer transition"
            >
              {suggestion.icon}
              <h2 className="text-sm font-medium hover:text-white">
                {suggestion.title}
              </h2>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="flex items-center justify-center flex-col">
          <h2 className="my-7 mt-14 flex gap-2 text-center">
            Not Sure where to start? <strong>See How it works</strong>
            <ArrowDown />
          </h2>

          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.example.com/dummy-video"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;

