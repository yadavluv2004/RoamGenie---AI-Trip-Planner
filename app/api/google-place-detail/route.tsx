import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { placeName, city } = await req.json();

    // ✅ Step 1: If no placeName, fallback directly
    if (!placeName || placeName.trim() === "") {
      return NextResponse.json({ image: "/placeholder.jpg" });
    }

    // ✅ Step 2: Build query safely
    const query = [placeName, city].filter(Boolean).join(" ");

    // ✅ Step 3: Try Unsplash search
    let unsplash = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 1 },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    });

    let photoUrl = unsplash.data?.results?.[0]?.urls?.regular;

    // ✅ Step 4: Fallback → generic "hotel"
    if (!photoUrl) {
      unsplash = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query: "hotel", per_page: 1 },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
      });
      photoUrl = unsplash.data?.results?.[0]?.urls?.regular;
    }

    // ✅ Step 5: Fallback → local placeholder
    if (!photoUrl) {
      photoUrl = "/placeholder.jpg";
    }

    return NextResponse.json({ image: photoUrl });
  } catch (error: any) {
    console.error("Unsplash API error:", {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
    });

    return NextResponse.json({ image: "/placeholder.jpg" }, { status: 500 });
  }
}
