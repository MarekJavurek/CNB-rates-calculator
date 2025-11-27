import { describe, it, expect } from "vitest";
import { parseCnbResponse } from "./useCnbRates.helpers";
import { mockCnbResponseText } from "../test/mock-data";

describe("parseCnbResponse", () => {
  it("should parse valid CNB response correctly", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    expect(result.date).toBe("27 Nov 2024");
    expect(result.serialNumber).toBe(230);
    expect(result.rates).toHaveLength(2);

    // Check first rate (EUR)
    expect(result.rates[0]).toEqual({
      country: "EMU",
      currency: "euro",
      amount: 1,
      code: "EUR",
      rate: 26.105,
      normalizedRate: 26.105,
    });
  });

  it("should normalize rates correctly for currencies with amount > 1", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    // Japan yen: amount=100, rate=15.644
    const jpyRate = result.rates.find((r) => r.code === "JPY");
    expect(jpyRate).toBeDefined();
    expect(jpyRate?.amount).toBe(100);
    expect(jpyRate?.rate).toBe(15.644);
    expect(jpyRate?.normalizedRate).toBe(0.15644);
  });

  it("should handle currencies with amount = 1", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    // EUR: amount=1, rate=26.105
    const eurRate = result.rates.find((r) => r.code === "EUR");
    expect(eurRate).toBeDefined();
    expect(eurRate?.amount).toBe(1);
    expect(eurRate?.rate).toBe(26.105);
    expect(eurRate?.normalizedRate).toBe(26.105);
  });

  it("should parse all expected currencies", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    const expectedCodes = ["EUR", "JPY"];

    const codes = result.rates.map((r) => r.code);
    expect(codes).toEqual(expectedCodes);
  });

  it("should throw error for invalid header format", () => {
    const invalidResponse = `Invalid Header
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|15.707`;

    expect(() => parseCnbResponse(invalidResponse)).toThrow(
      "Invalid CNB response format: unable to parse header"
    );
  });

  it("should handle empty lines in response", () => {
    const responseWithEmptyLines = `27 Nov 2024 #230
Country|Currency|Amount|Code|Rate

EMU|euro|1|EUR|26.105

Japan|yen|100|JPY|15.644
`;

    const result = parseCnbResponse(responseWithEmptyLines);
    expect(result.rates).toHaveLength(2);
  });

  it("should skip lines with invalid format", () => {
    const responseWithInvalidLines = `27 Nov 2024 #230
Country|Currency|Amount|Code|Rate
EMU|euro|1|EUR|26.105
Invalid|Line
Japan|yen|100|JPY|15.644`;

    const result = parseCnbResponse(responseWithInvalidLines);
    expect(result.rates).toHaveLength(2);
    expect(result.rates[0].code).toBe("EUR");
    expect(result.rates[1].code).toBe("JPY");
  });

  it("should parse decimal rates correctly", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    const eurRate = result.rates.find((r) => r.code === "EUR");
    expect(eurRate).toBeDefined();
    expect(eurRate?.rate).toBe(26.105);
    expect(eurRate?.normalizedRate).toBe(26.105);
  });

  it("should handle rates with 3 decimal places", () => {
    const result = parseCnbResponse(mockCnbResponseText);

    const eurRate = result.rates.find((r) => r.code === "EUR");
    expect(eurRate?.rate).toBe(26.105);
  });

  it("should correctly parse serial number", () => {
    const response1 = `01 Jan 2024 #1
Country|Currency|Amount|Code|Rate
EMU|euro|1|EUR|26.105`;

    const response2 = `31 Dec 2024 #255
Country|Currency|Amount|Code|Rate
EMU|euro|1|EUR|26.105`;

    const result1 = parseCnbResponse(response1);
    const result2 = parseCnbResponse(response2);

    expect(result1.serialNumber).toBe(1);
    expect(result2.serialNumber).toBe(255);
  });
});
