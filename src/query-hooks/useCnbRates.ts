import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import { env } from "../env";
import { parseCnbResponse } from "./useCnbRates.helpers";
import type { CnbRatesResponse } from "../types/cnb";

async function fetchCnbRates(): Promise<CnbRatesResponse> {
  const response = await axios.get<string>(env.FE_CNB_API_URL, {
    responseType: "text",
  });

  return parseCnbResponse(response.data);
}

export function useCnbRates() {
  return useQuery({
    queryKey: ["cnb-rates", "cnb"],
    queryFn: fetchCnbRates,
    // just for demonstration, in real app we might want to calc time to 2.30 p.m.
    // when CNB releases new rates...
    staleTime: ms("1h"),
    gcTime: ms("2h"),
  });
}
