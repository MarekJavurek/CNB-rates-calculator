import type { VercelRequest, VercelResponse } from "@vercel/node";

const allowedOrigin = "*";
const allowedMethods = "GET,OPTIONS";
const cnbApiUrlEnvVar = "CNB_API_URL" as const;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // quick OPTIONS impl to keep the proxy simple
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({
      error: `Method not allowed, supporting only: ${allowedMethods}`,
    });
    return;
  }

  const cnbApiUrl = process.env[cnbApiUrlEnvVar];

  if (!cnbApiUrl) {
    res.status(500).json({
      error: `env var ${cnbApiUrlEnvVar} is not configured`,
    });
    return;
  }

  try {
    const cnbResponse = await fetch(cnbApiUrl, {
      headers: { "User-Agent": "cnb-rates-calculator-proxy" },
    });

    const bodyText = await cnbResponse.text();

    if (!cnbResponse.ok) {
      res.status(cnbResponse.status).send(bodyText);
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    // 5 min cache + 10 min stale while revalidate
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(bodyText);
  } catch (error) {
    const errMsg = "Failed to fetch CNB rates";
    console.error(errMsg, error);
    res.status(502).json({ error: errMsg });
  }
}
