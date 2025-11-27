import type { CnbRatesResponse } from "../types/cnb";

/**
 * Sample CNB API response text for testing
 * Simplified to only EUR and JPY for minimal test data
 */
export const mockCnbResponseText = `27 Nov 2024 #230
Country|Currency|Amount|Code|Rate
EMU|euro|1|EUR|26.105
Japan|yen|100|JPY|15.644`;

/**
 * Parsed mock CNB response for testing
 * Contains only EUR and JPY - minimal set for testing currency conversion
 */
export const mockCnbRatesResponse: CnbRatesResponse = {
  date: "27 Nov 2024",
  serialNumber: 230,
  rates: [
    {
      country: "EMU",
      currency: "euro",
      amount: 1,
      code: "EUR",
      rate: 26.105,
      normalizedRate: 26.105,
    },
    {
      country: "Japan",
      currency: "yen",
      amount: 100,
      code: "JPY",
      rate: 15.644,
      normalizedRate: 0.15644,
    },
  ],
};
