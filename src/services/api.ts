import type {
  ApiOrder,
  HealthResponse,
  MarketSummary,
  OrderbookSnapshot,
  PlaceOrderPayload,
} from "@/types";
import { env } from "@/config/env";

function apiUrl(path: string): string {
  const base = env.apiBaseUrl || "";
  const prefix = base ? `${base}${path}` : `/api${path}`;
  return prefix;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const predictionApi = {
  async health(): Promise<HealthResponse> {
    const res = await fetch(apiUrl("/health"));
    return parseJson<HealthResponse>(res);
  },

  async listMarkets(): Promise<MarketSummary[]> {
    const res = await fetch(apiUrl("/markets"));
    return parseJson<MarketSummary[]>(res);
  },

  async getOrderbook(marketId: string): Promise<OrderbookSnapshot> {
    const res = await fetch(apiUrl(`/markets/${encodeURIComponent(marketId)}/orderbook`));
    return parseJson<OrderbookSnapshot>(res);
  },

  async placeOrder(body: PlaceOrderPayload): Promise<ApiOrder> {
    const res = await fetch(apiUrl("/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return parseJson<ApiOrder>(res);
  },

  async cancelOrder(orderId: string): Promise<{ ok: boolean }> {
    const res = await fetch(apiUrl(`/orders/${encodeURIComponent(orderId)}`), {
      method: "DELETE",
    });
    return parseJson<{ ok: boolean }>(res);
  },

  async listMyOrders(address: string): Promise<ApiOrder[]> {
    const q = new URLSearchParams({ maker: address });
    const res = await fetch(apiUrl(`/orders?${q.toString()}`));
    return parseJson<ApiOrder[]>(res);
  },
};
