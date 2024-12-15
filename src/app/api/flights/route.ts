import { processFlightData } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase();
    const apiKey = process.env.FLIGHT_API_KEY;
    const response = await axios.get(
      `https://api.flightapi.io/compschedule/${apiKey}?mode=arrivals&day=1&iata=${code}`
    );

    if (response.data.length === 0) {
      return NextResponse.json({ error: "No flights found" }, { status: 404 });
    }
    const transformedData = processFlightData(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Error fetching flight data" },
      { status: 500 }
    );
  }
}
