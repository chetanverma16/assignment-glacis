import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase();
    const apiKey = process.env.FLIGHT_API_KEY;
    const response = await axios.get(
      `https://api.flightapi.io/compschedule/${apiKey}?mode=arrivals&day=1&iata=${code}`
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Error fetching flight data" },
      { status: 500 }
    );
  }
}
