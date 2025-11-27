import type { CnbRatesResponse } from "../types/cnb";

export function parseCnbResponse(text: string): CnbRatesResponse {
  const lines = text.trim().split("\n");

  // First line contains date and serial number, e.g.: "25 Nov 2025 #228"
  const headerLine = lines[0];
  const headerMatch = headerLine.match(/^(.+?)\s+#(\d+)$/);

  if (!headerMatch) {
    throw new Error("Invalid CNB response format: unable to parse header");
  }

  const [, dateStr, serialNumberStr] = headerMatch;
  const date = dateStr.trim();
  const serialNumber = Number.parseInt(serialNumberStr, 10);

  // Second line contains column names (we skip it)
  // Data starts from the third line
  const rates: CnbRatesResponse["rates"] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split("|");
    if (parts.length !== 5) continue;

    const amount = Number.parseInt(parts[2].trim(), 10);
    const rate = Number.parseFloat(parts[4].trim());

    rates.push({
      country: parts[0].trim(),
      currency: parts[1].trim(),
      amount,
      code: parts[3].trim(),
      rate,
      normalizedRate: rate / amount,
    });
  }

  return {
    date,
    serialNumber,
    rates,
  };
}
