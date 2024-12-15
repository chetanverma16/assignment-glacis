"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FlightCount {
  Country: string;
  "# of Flights": number;
}

export default function Home() {
  const [airportCode, setAirportCode] = useState("");
  const debouncedAirportCode = useDebounce(airportCode, 500);

  const {
    data: flightsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["flights", debouncedAirportCode],
    queryFn: async () => {
      if (!debouncedAirportCode || debouncedAirportCode.length < 3) return;
      const response = await fetch(`/api/flights?code=${debouncedAirportCode}`);
      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }
      return response.json();
    },
    enabled: debouncedAirportCode.length >= 3, // Only run query if code is valid
    retry: false, // Disable retry on failure
  });

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-center text-4xl font-bold">Flights By Country</h1>
        <Input
          className="w-full uppercase max-w-sm"
          placeholder="Enter Airport Code"
          value={airportCode}
          onChange={(e) => setAirportCode(e.target.value)}
          maxLength={3}
        />

        {/* Render loading, error, or data */}
        {isLoading && <Skeleton className="h-10 w-full" />}
        {error && <p>{error.message}</p>}
        {flightsData?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead># of Flights</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flightsData.map((item: FlightCount) => {
                if (item.Country) {
                  return (
                    <TableRow key={item.Country}>
                      <TableCell>{item.Country}</TableCell>
                      <TableCell>{item["# of Flights"]}</TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
