export type OutcomeSide = "YES" | "NO";

export type MarketStatus = "open" | "closed" | "resolved";

export interface MarketSummary {
  id: string;
  question: string;
  endTime: number;
  status: MarketStatus;
  /** Implied probability 0–1 for YES from on-chain pool or indexer */
  yesPrice?: number;
  volumeUsd?: string;
  chainId: number;
}

export interface OnChainMarket {
  id: bigint;
  question: string;
  endTime: bigint;
  resolved: boolean;
  winningOutcome: number;
  yesShares: bigint;
  noShares: bigint;
  collateralReserve: bigint;
}

export interface OrderbookLevel {
  price: string;
  size: string;
  total: string;
}

export interface OrderbookSnapshot {
  marketId: string;
  bidsYes: OrderbookLevel[];
  asksYes: OrderbookLevel[];
  lastTradePrice?: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  marketId: string;
  side: OutcomeSide;
  /** Limit price for YES outcome token, 0–1 decimal string */
  price: string;
  size: string;
  /** EIP-712 or server-defined signature from wallet */
  signature?: string;
  nonce?: string;
}

export interface ApiOrder {
  id: string;
  marketId: string;
  side: OutcomeSide;
  price: string;
  size: string;
  filled: string;
  status: "open" | "partial" | "filled" | "cancelled";
  createdAt: string;
}

export interface HealthResponse {
  ok: boolean;
  version?: string;
}
