import type { IncomingMessage, ServerResponse } from "node:http";

type VercelRequest = IncomingMessage & {
  method?: string;
};

type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  send: (body: unknown) => VercelResponse;
};

const allowedOrigin = "*";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Fast-path CORS preflight to keep the proxy lightweight.
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const targetUrl = process.env.CNB_API_URL;

  if (!targetUrl) {
    res.status(500).json({ error: "CNB API URL is not configured" });
    return;
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: { "User-Agent": "cnb-rates-calculator-proxy" },
    });

    const bodyText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).send(bodyText);
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(bodyText);
  } catch (error) {
    console.error("Failed to fetch CNB rates", error);
    res.status(502).json({ error: "Failed to fetch CNB rates" });
  }
}
