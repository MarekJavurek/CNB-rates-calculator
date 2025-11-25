import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import { env } from "../env";
import { parseCnbResponse } from "./useCnbRates.helpers";

export interface CnbRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
  normalizedRate: number;
}

export interface CnbRatesResponse {
  date: string;
  serialNumber: number;
  rates: CnbRate[];
}

async function fetchCnbRates(): Promise<CnbRatesResponse> {
  const response = await axios.get<string>(env.FE_CNB_API_URL, {
    responseType: "text",
  });

  return parseCnbResponse(response.data);
}

export function useCnbRates() {
  return useQuery({
    queryKey: ["cnb-rates"],
    queryFn: fetchCnbRates,
    staleTime: ms("1h"), // 1 hodina - kurzy se aktualizují denně
    gcTime: ms("24h"), // 24 hodin
  });
}
