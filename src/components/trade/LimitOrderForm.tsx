import { useState } from "react";
import { useAccount } from "wagmi";
import { usePlaceLimitOrder } from "@/hooks/usePlaceLimitOrder";
import type { OutcomeSide } from "@/types";

export function LimitOrderForm({ marketId }: { marketId: string }) {
  const { isConnected, address } = useAccount();
  const mutation = usePlaceLimitOrder(marketId);
  const [side, setSide] = useState<OutcomeSide>("YES");
  const [price, setPrice] = useState("0.55");
  const [size, setSize] = useState("100");

  return (
    <div className="card card-pad">
      <h2 className="h2">Limit order (backend)</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Posts to <code>POST /orders</code>. Wire EIP-712 signing in your API layer; this form sends a
        placeholder payload for integration testing.
      </p>
      <div className="stack">
        <div className="field">
          <label htmlFor="side">Side</label>
          <select
            id="side"
            className="input"
            value={side}
            onChange={(e) => setSide(e.target.value as OutcomeSide)}
          >
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="price">Limit price (0–1, YES)</label>
          <input
            id="price"
            className="input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div className="field">
          <label htmlFor="size">Size</label>
          <input
            id="size"
            className="input"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            inputMode="decimal"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!isConnected || mutation.isPending}
          onClick={() => {
            mutation.mutate({
              marketId,
              side,
              price,
              size,
              signature: address ? `0xplaceholder_${address.slice(2, 10)}` : undefined,
            });
          }}
        >
          {mutation.isPending ? "Submitting…" : "Submit limit order"}
        </button>
        {mutation.isError ? (
          <p style={{ color: "var(--danger)", margin: 0, fontSize: "0.85rem" }}>
            {mutation.error instanceof Error ? mutation.error.message : String(mutation.error)}
          </p>
        ) : null}
        {mutation.isSuccess ? (
          <p style={{ color: "var(--yes)", margin: 0, fontSize: "0.85rem" }}>
            Order accepted: {mutation.data.id}
          </p>
        ) : null}
      </div>
    </div>
  );
}
