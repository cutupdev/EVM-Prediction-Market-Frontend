function parseChainId(raw: string | undefined): number {
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n;
  return 11_155_111;
}

export const env = {
  predictionMarketAddress: (import.meta.env.VITE_PREDICTION_MARKET_ADDRESS ?? "") as `0x${string}` | "",
  collateralTokenAddress: (import.meta.env.VITE_COLLATERAL_TOKEN_ADDRESS ?? "") as `0x${string}` | "",
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "",
  defaultChainId: parseChainId(import.meta.env.VITE_DEFAULT_CHAIN_ID),
  /** Empty string → use same-origin `/api` (Vite dev proxy) */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, ""),
  apiWsUrl: (import.meta.env.VITE_API_WS_URL ?? "").replace(/\/$/, ""),
} as const;

export function hasContractConfig(): boolean {
  return (
    typeof env.predictionMarketAddress === "string" &&
    env.predictionMarketAddress.length === 42 &&
    env.predictionMarketAddress.startsWith("0x")
  );
}
