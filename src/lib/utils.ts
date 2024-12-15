import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function processFlightData(dataArray: unknown[]) {
  const countryFlightsMap = new Map();
  dataArray.forEach((data: unknown) => {
    const typedData = data as {
      airport?: {
        pluginData?: {
          schedule?: {
            arrivals?: {
              data?: Array<{
                flight?: {
                  aircraft?: {
                    country?: {
                      name?: string;
                    };
                  };
                };
              }>;
            };
          };
        };
      };
    };
    const arrivals =
      typedData?.airport?.pluginData?.schedule?.arrivals?.data || [];
    arrivals.forEach(
      (flight: {
        flight?: {
          aircraft?: {
            country?: {
              name?: string;
            };
          };
        };
      }) => {
        console.log("Flight", flight);
        const country = flight?.flight?.aircraft?.country?.name;
        console.log("Country", country);
        if (country && countryFlightsMap.has(country)) {
          countryFlightsMap.set(country, countryFlightsMap.get(country) + 1);
        } else {
          countryFlightsMap.set(country, 1);
        }
      }
    );
  });

  const result = Array.from(countryFlightsMap, ([country, flights]) => ({
    Country: country,
    "# of Flights": flights,
  }));

  return result;
}
