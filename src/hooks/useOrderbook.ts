import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { predictionApi } from "@/services/api";
import type { OrderbookSnapshot } from "@/types";
import { env } from "@/config/env";

const STALE_MS = 5_000;

function emptySnapshot(marketId: string): OrderbookSnapshot {
  return {
    marketId,
    bidsYes: [],
    asksYes: [],
    updatedAt: new Date().toISOString(),
  };
}

export function useOrderbook(marketId: string | undefined) {
  const queryClient = useQueryClient();
  const key = useMemo(() => ["orderbook", marketId] as const, [marketId]);

  const query = useQuery({
    queryKey: key,
    enabled: Boolean(marketId),
    staleTime: STALE_MS,
    queryFn: async () => {
      if (!marketId) throw new Error("marketId required");
      try {
        return await predictionApi.getOrderbook(marketId);
      } catch {
        return emptySnapshot(marketId);
      }
    },
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!marketId || !env.apiWsUrl) return;

    const url = `${env.apiWsUrl}?marketId=${encodeURIComponent(marketId)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as OrderbookSnapshot;
        if (data.marketId === marketId) {
          queryClient.setQueryData(key, data);
        }
      } catch {
        /* ignore malformed */
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [marketId, queryClient, key]);

  return query;
}
