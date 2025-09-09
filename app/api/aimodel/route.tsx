import { NextRequest, NextResponse } from "next/server";

import { aj } from "@/lib/arcjet";

import { auth, currentUser } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";


const PROMPT = `
You are an AI Trip Planner Agent.  

Your task is to help the user plan a trip by asking **exactly one relevant trip-related question at a time**.  

⚠️ Very Important:
- You must **always return ONLY a valid JSON object**.  
- Never output explanations, commentary, or markdown.  
- Never include extra keys or fields outside the schema.  
- \`resp\` must always be a natural, conversational question for the user.  
- \`ui\` must always exactly match one of the allowed values.  

Ask about the following details in this strict order, one at a time:
1. Starting location (\`source\`)  
2. Destination city or country (\`destination\`)  
3. Group size (\`groupSize\`) → Solo, Couple, Family, Friends  
4. Budget (\`budget\`) → Low, Medium, High  
5. Trip duration (\`tripDuration\`) → number of days  
6. Travel interests (\`interests\`) → adventure, sightseeing, cultural, food, nightlife, relaxation  
7. Special requirements or preferences (\`preferences\`)  

Once all required details are collected, set \`ui\` to "final".  

---

### Schema (you must strictly follow this):
{
  "resp": "string — the exact question to ask the user",
  "ui": "source | destination | groupSize | budget | tripDuration | interests | preferences | final"
}

---

Rules:
- Always output only JSON, never text outside JSON.  
- Never ask multiple questions in one response.  
- Never invent new \`ui\` values.  
- If you are unsure, still return a valid JSON object with the best matching \`ui\`.  
`;

const FINAL_PROMPT = `
You are an AI Trip Planner Agent.  

At this stage, all required trip details have been collected.  

⚠️ Very Important:
- You must **always return ONLY a valid JSON object**.  
- Never output explanations, commentary, or markdown.  
- Never include extra keys or fields outside the schema.  
- All values must strictly follow the schema below.  
- If information is missing, use placeholders: "TBD" (string) or 0 (number).  

---

### Schema (you must strictly follow this):
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": number,
          "longitude": number
        },
        "rating": number,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": number,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": number,
              "longitude": number
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}

---

Rules:
- Return **only** the JSON object.  
- Do **not** wrap in markdown or quotes.  
- Do **not** add comments or text.  
- Every key must be present exactly as defined in the schema.  
- Do **not** invent new fields.  
- Use "TBD" or 0 if data is missing.  
`;

type Message = {
  role: "user" | "assistant";
  content: string;
};


export async function POST(req: NextRequest) {
  const { messages, isFinal }: { messages: Message[]; isFinal: boolean } = await req.json();

  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "monthly" });

  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress ?? "",
    requested: isFinal ? 5 : 0,
  });

// @ts-ignore
if (decision?.reason?.remaining === 0 && !hasPremiumAccess) {
  return NextResponse.json({
    resp: "Your daily limit has been reached",
    ui: "limit",
  });
}




  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT },
        ...messages,
      ],
    });

    const message = completion.choices[0].message;
    let cleanMessage = (message.content ?? "")
      .replace(/<\|.*?\|>/g, "") // remove OpenRouter junk tags
      .replace(/^(final\s*json|json|final|assistantfinal)[:\s]*/gi, "")
      .trim();

    // Extract JSON if wrapped
    const jsonMatch = cleanMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanMessage = jsonMatch[0];

    let content: any;
    try {
      content = JSON.parse(cleanMessage);
    } catch {
      content = { resp: cleanMessage || "", ui: "" };
    }

    const steps = [
      "source",
      "destination",
      "groupSize",
      "budget",
      "tripDuration",

    ];

    // Count only AI messages
const aiMessagesCount = messages.filter((msg: Message) => msg.role === "assistant").length;


if (isFinal) {
  content.resp = "Here is your complete trip plan.";
  content.ui = "final";
}


    // Remove any embedded UI hints in response
    if (typeof content.resp === "string") {
      content.resp = content.resp.replace(/ui\s*[:`]*\s*[a-zA-Z]+/gi, "").trim();
    }

    return NextResponse.json(content);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
