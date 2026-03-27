import { useMemo } from "react";
import { useIndexedMarkets } from "@/hooks/useIndexedMarkets";
import { useOnChainMarkets } from "@/hooks/useOnChainMarkets";
import type { MarketSummary } from "@/types";

export function useMergedMarkets() {
  const onChain = useOnChainMarkets();
  const indexed = useIndexedMarkets();

  const merged: MarketSummary[] = useMemo(() => {
    const byId = new Map<string, MarketSummary>();
    for (const m of onChain.markets) {
      byId.set(m.id, { ...m });
    }
    for (const m of indexed.data ?? []) {
      const prev = byId.get(m.id);
      if (prev) {
        byId.set(m.id, {
          ...prev,
          ...m,
          question: m.question || prev.question,
          volumeUsd: m.volumeUsd ?? prev.volumeUsd,
        });
      } else {
        byId.set(m.id, m);
      }
    }
    return [...byId.values()].sort((a, b) => Number(b.id) - Number(a.id));
  }, [onChain.markets, indexed.data]);

  return {
    merged,
    onChain,
    indexed,
    isLoading: onChain.isLoading || indexed.isLoading,
    error: onChain.error,
  };
}
