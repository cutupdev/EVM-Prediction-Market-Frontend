import { useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { usePredictionActions } from "@/hooks/usePredictionActions";

export function CreateMarketForm() {
  const { isConnected } = useAccount();
  const { createMarket, phase, lastError, configOk, reset } = usePredictionActions(6);
  const [question, setQuestion] = useState("Will ETH close above $4k this quarter?");
  const [endLocal, setEndLocal] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 16);
  });
  const [liquidity, setLiquidity] = useState("1000");

  const busy = phase === "pending" || phase === "confirming";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const endSec = BigInt(Math.floor(new Date(endLocal).getTime() / 1000));
    void createMarket(question.trim(), endSec, liquidity);
  };

  return (
    <div className="card card-pad">
      <h2 className="h2">Create market</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Calls <code>createMarket</code> on your deployed contract. Requires oracle / resolver roles on
        the contract side for production.
      </p>
      {!configOk ? <p className="muted">Configure env addresses first.</p> : null}
      <form className="stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="q">Question</label>
          <input
            id="q"
            className="input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="end">Resolution deadline (local)</label>
          <input
            id="end"
            type="datetime-local"
            className="input"
            value={endLocal}
            onChange={(e) => setEndLocal(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="liq">Initial liquidity (collateral)</label>
          <input
            id="liq"
            className="input"
            value={liquidity}
            onChange={(e) => setLiquidity(e.target.value)}
            inputMode="decimal"
            required
          />
        </div>
        <div className="row" style={{ gap: "0.5rem" }}>
          <button type="submit" className="btn btn-primary" disabled={!isConnected || !configOk || busy}>
            {busy ? "Confirm in wallet…" : "Create on-chain"}
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
            Submitted. New markets appear after the next indexer / RPC refresh.
          </p>
        ) : null}
      </form>
    </div>
  );
}
