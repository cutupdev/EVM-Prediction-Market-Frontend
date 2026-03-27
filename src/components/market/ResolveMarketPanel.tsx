import { useState } from "react";
import { useAccount } from "wagmi";
import { usePredictionActions } from "@/hooks/usePredictionActions";

export function ResolveMarketPanel({ marketId }: { marketId: string }) {
  const { isConnected } = useAccount();
  const { resolveMarket, phase, lastError, configOk, reset } = usePredictionActions();
  const [winner, setWinner] = useState<0 | 1>(0);

  let id: bigint;
  try {
    id = BigInt(marketId);
  } catch {
    return null;
  }

  const busy = phase === "pending" || phase === "confirming";

  return (
    <div className="card card-pad" style={{ borderColor: "rgba(251, 113, 133, 0.35)" }}>
      <h2 className="h2">Resolve (oracle / admin)</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Calls <code>resolveMarket</code>. Restrict this on your contract to trusted roles.
      </p>
      <div className="stack">
        <div className="field">
          <label htmlFor="winner">Winning outcome</label>
          <select
            id="winner"
            className="input"
            value={winner}
            onChange={(e) => setWinner(Number(e.target.value) as 0 | 1)}
          >
            <option value={0}>YES wins</option>
            <option value={1}>NO wins</option>
          </select>
        </div>
        <div className="row" style={{ gap: "0.5rem" }}>
          <button
            type="button"
            className="btn"
            style={{ borderColor: "rgba(251, 113, 133, 0.45)" }}
            disabled={!isConnected || !configOk || busy}
            onClick={() => void resolveMarket(id, winner)}
          >
            {busy ? "Confirm in wallet…" : "Resolve market"}
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
      </div>
    </div>
  );
}
