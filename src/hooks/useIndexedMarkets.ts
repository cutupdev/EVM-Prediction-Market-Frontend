import { useQuery } from "@tanstack/react-query";
import { predictionApi } from "@/services/api";
import type { MarketSummary } from "@/types";

/**
 * Optional indexer / REST list of markets (richer metadata than pure RPC).
 */
export function useIndexedMarkets() {
  return useQuery({
    queryKey: ["indexed-markets"],
    staleTime: 30_000,
    queryFn: async (): Promise<MarketSummary[]> => {
      try {
        return await predictionApi.listMarkets();
      } catch {
        return [];
      }
    },
  });
}
