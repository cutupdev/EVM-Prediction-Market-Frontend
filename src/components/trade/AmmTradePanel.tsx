import { useState } from "react";
import { useAccount } from "wagmi";
import { usePredictionActions } from "@/hooks/usePredictionActions";

export function AmmTradePanel({ marketId }: { marketId: string }) {
  const { isConnected } = useAccount();
  const { buyOutcome, phase, lastError, configOk, reset } = usePredictionActions(6);
  const [amount, setAmount] = useState("10");
  const [outcome, setOutcome] = useState<0 | 1>(0);

  let id: bigint;
  try {
    id = BigInt(marketId);
  } catch {
    return (
      <div className="card card-pad">
        <h2 className="h2">AMM trade</h2>
        <p className="muted">Invalid market id.</p>
      </div>
    );
  }

  const busy = phase === "pending" || phase === "confirming";

  return (
    <div className="card card-pad">
      <h2 className="h2">AMM (on-chain)</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Swap collateral for outcome shares via <code>buyOutcome</code>. Slippage guard uses{" "}
        <code>minSharesOut = 0</code> here — tighten in production.
      </p>
      {!configOk ? (
        <p className="muted">Configure market + collateral addresses in env.</p>
      ) : null}
      <div className="stack">
        <div className="field">
          <label htmlFor="collateral">Collateral amount (token decimals from hook default: 6)</label>
          <input
            id="collateral"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
          />
        </div>
        <div className="field">
          <label htmlFor="outcome">Outcome</label>
          <select
            id="outcome"
            className="input"
            value={outcome}
            onChange={(e) => setOutcome(Number(e.target.value) as 0 | 1)}
          >
            <option value={0}>YES (0)</option>
            <option value={1}>NO (1)</option>
          </select>
        </div>
        <div className="row" style={{ gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!isConnected || !configOk || busy}
            onClick={() => {
              void buyOutcome(id, outcome, amount, 0n);
            }}
          >
            {busy ? "Confirm in wallet…" : "Buy shares"}
          </button>
          {lastError ? (
            <button type="button" className="btn" onClick={reset}>
              Reset
            </button>
          ) : null}
        </div>
        {lastError ? (
          <p style={{ color: "var(--danger)", margin: 0, fontSize: "0.85rem" }}>{lastError}</p>
        ) : null}
        {phase === "success" ? (
          <p style={{ color: "var(--yes)", margin: 0, fontSize: "0.85rem" }}>
            Transaction mined. Refresh markets for updated pool.
          </p>
        ) : null}
      </div>
    </div>
  );
}
