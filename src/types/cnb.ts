export type CnbRate = {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
  normalizedRate: number;
};

export type CnbRatesResponse = {
  date: string;
  serialNumber: number;
  rates: CnbRate[];
};
