import { useMemo } from "react";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { predictionMarketAbi } from "@/abi/predictionMarket";
import { env } from "@/config/env";
import type { MarketSummary, OnChainMarket } from "@/types";
import { impliedYesPrice } from "@/lib/format";

function toSummary(m: OnChainMarket, chainId: number): MarketSummary {
  const now = Date.now() / 1000;
  const end = Number(m.endTime);
  let status: MarketSummary["status"] = "open";
  if (m.resolved) status = "resolved";
  else if (end < now) status = "closed";

  return {
    id: m.id.toString(),
    question: m.question,
    endTime: end * 1000,
    status,
    yesPrice: impliedYesPrice(m.yesShares, m.noShares),
    chainId,
  };
}

export function useOnChainMarkets() {
  const chainId = useChainId();
  const address =
    env.predictionMarketAddress.length === 42
      ? (env.predictionMarketAddress as `0x${string}`)
      : undefined;

  const nextId = useReadContract({
    address,
    abi: predictionMarketAbi,
    functionName: "nextMarketId",
    query: { enabled: Boolean(address) },
  });

  const count = nextId.data != null ? Number(nextId.data) : 0;
  const ids = useMemo(
    () => Array.from({ length: Math.max(0, count) }, (_, i) => BigInt(i)),
    [count],
  );

  const contracts = useMemo(
    () =>
      ids.map((id) => ({
        address: address!,
        abi: predictionMarketAbi,
        functionName: "markets" as const,
        args: [id] as const,
      })),
    [address, ids],
  );

  const marketsRead = useReadContracts({
    contracts,
    query: { enabled: Boolean(address && contracts.length > 0) },
  });

  const markets: MarketSummary[] = useMemo(() => {
    if (!marketsRead.data || !chainId) return [];
    const out: MarketSummary[] = [];
    for (const row of marketsRead.data) {
      if (row.status !== "success" || !row.result) continue;
      const m = row.result as OnChainMarket;
      out.push(toSummary(m, chainId));
    }
    return out;
  }, [marketsRead.data, chainId]);

  return {
    address,
    isLoading: nextId.isLoading || marketsRead.isLoading,
    error: nextId.error ?? marketsRead.error,
    markets,
    refetch: () => {
      void nextId.refetch();
      void marketsRead.refetch();
    },
  };
}
