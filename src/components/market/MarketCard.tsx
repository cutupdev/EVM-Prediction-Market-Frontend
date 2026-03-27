import { Link } from "react-router-dom";
import type { MarketSummary } from "@/types";

function statusClass(s: MarketSummary["status"]) {
  if (s === "open") return "badge badge-open";
  if (s === "closed") return "badge badge-closed";
  return "badge badge-resolved";
}

export function MarketCard({ market }: { market: MarketSummary }) {
  const yes = market.yesPrice != null ? `${(market.yesPrice * 100).toFixed(1)}¢` : "—";
  return (
    <Link to={`/market/${market.id}`} className="card market-card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className={statusClass(market.status)}>{market.status}</span>
        <span className="muted" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>
          #{market.id}
        </span>
      </div>
      <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.35 }}>{market.question}</p>
      <div className="row" style={{ justifyContent: "space-between", marginTop: "auto" }}>
        <div>
          <div className="muted" style={{ fontSize: "0.75rem" }}>
            Implied YES
          </div>
          <div className="price-pill" style={{ color: "var(--yes)" }}>
            {yes}
          </div>
        </div>
        <div className="muted" style={{ fontSize: "0.8rem", textAlign: "right" }}>
          Ends
          <br />
          {new Date(market.endTime).toLocaleString()}
        </div>
      </div>
    </Link>
  );
}
