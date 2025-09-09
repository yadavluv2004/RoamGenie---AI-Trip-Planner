"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDays from "./SelectDays";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/convex/_generated/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string; // ✅ fixed spelling
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary;
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitide: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit: string;
  activities: Activity[];
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const { userDetail } = useUserDetail();
  const saveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { setTripDetailInfo } = useTripDetail();

  const onSend = async (input?: string) => {
    const text = input ?? userInput;
    if (!text.trim()) return;

    setLoading(true);
    const newMsg: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");

    try {
      const result = await axios.post("/api/aimodel", {
        messages: [...messages, newMsg],
        isFinal: isFinal,
      });

      console.log("Trip response:", JSON.stringify(result.data, null, 2));

      !isFinal &&
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: result?.data?.resp || "No response",
            ui: result.data?.ui,
          },
        ]);

      // ✅ FIXED: always set tripDetail if available
      if (isFinal) {
        const tripPlan = result?.data?.trip_plan;

        if (tripPlan) {
          setTripDetail(tripPlan); // local state
          setTripDetailInfo(tripPlan); // context

          if (userDetail?._id) {
            const tripId = uuidv4();
            await saveTripDetail({
              tripDetail: tripPlan,
              tripId,
              uid: userDetail._id,
            });
          } else {
            console.warn("⚠️ Missing userDetail, skipping saveTripDetail.");
          }
        } else {
          console.warn("⚠️ Missing tripPlan in final response.");
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not fetch response." },
      ]);
    }

    setLoading(false);
  };

  const RenderGenerativeUi = (ui: string, content: string) => {
    if (ui === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "groupSize") {
      return (
        <GroupSizeUi
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "tripDuration") {
      return (
        <SelectDays
          onSelectedOption={(v: string) => {
            onSend(v);
          }}
        />
      );
    } else if (ui === "final") {
      return (
        <FinalUi
          viewTrip={() => console.log("View Trip Clicked")}
          disable={!tripDetail} // ✅ FIXED: disable only when no tripDetail
        />
      );
    }

    return null;
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final") {
      setIsFinal(true);
      setUserInput("OK, Great!");
    }
  }, [messages]);

  useEffect(() => {
    if (isFinal && userInput) {
      onSend();
    }
  }, [isFinal]);

  return (
    <div className="h-[85vh] flex flex-col">
      {/* Empty State */}
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
            onSend(v);
          }}
        />
      )}

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div key={index} className="flex justify-end mt-2">
              <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={index} className="flex justify-start mt-2">
              <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "", msg.content)}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
              <Loader className="animate-spin" />
            </div>
          </div>
        )}
      </section>

      {/* Input */}
      <section>
        <div className="border rounded-2xl p-4 relative">
          <Textarea
            placeholder="Create a trip from Paris to New York"
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size="icon"
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
            disabled={loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;
