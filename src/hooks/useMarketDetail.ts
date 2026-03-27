import { useReadContract } from "wagmi";
import { predictionMarketAbi } from "@/abi/predictionMarket";
import { env } from "@/config/env";

export function useMarketDetail(marketId: string | undefined) {
  const address =
    env.predictionMarketAddress.length === 42
      ? (env.predictionMarketAddress as `0x${string}`)
      : undefined;

  let id: bigint | undefined;
  try {
    id = marketId != null && marketId !== "" ? BigInt(marketId) : undefined;
  } catch {
    id = undefined;
  }

  return useReadContract({
    address,
    abi: predictionMarketAbi,
    functionName: "markets",
    args: id != null ? [id] : undefined,
    query: { enabled: Boolean(address && id != null) },
  });
}
