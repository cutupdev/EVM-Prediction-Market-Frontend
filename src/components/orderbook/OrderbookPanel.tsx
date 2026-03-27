import type { OrderbookSnapshot } from "@/types";

function LevelsTable({
  title,
  className,
  levels,
  side,
}: {
  title: string;
  className: string;
  levels: OrderbookSnapshot["bidsYes"];
  side: "bid" | "ask";
}) {
  const rows = side === "ask" ? [...levels].reverse() : levels;
  return (
    <div>
      <div className={`ob-side-title ${className}`}>{title}</div>
      <table className="table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Size</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="muted">
                No levels
              </td>
            </tr>
          ) : (
            rows.map((l, i) => (
              <tr key={`${side}-${i}-${l.price}`}>
                <td>{l.price}</td>
                <td>{l.size}</td>
                <td className="muted">{l.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function OrderbookPanel({
  snapshot,
  isLoading,
}: {
  snapshot: OrderbookSnapshot | undefined;
  isLoading: boolean;
}) {
  if (isLoading && !snapshot) {
    return (
      <div className="card card-pad">
        <h2 className="h2">Order book</h2>
        <p className="muted">Loading depth…</p>
      </div>
    );
  }

  const s = snapshot;
  return (
    <div className="card card-pad">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <h2 className="h2" style={{ margin: 0 }}>
          Order book
        </h2>
        {s?.lastTradePrice ? (
          <span className="muted" style={{ fontFamily: "var(--mono)", fontSize: "0.85rem" }}>
            Last {s.lastTradePrice}
          </span>
        ) : null}
      </div>
      <p className="muted" style={{ marginTop: 0, fontSize: "0.85rem" }}>
        YES bids / asks (limit orders). Backed by your REST API; falls back to empty when offline.
      </p>
      <div className="grid-2" style={{ marginTop: "0.5rem" }}>
        <LevelsTable title="Bids (buy YES)" className="ob-yes" levels={s?.bidsYes ?? []} side="bid" />
        <LevelsTable title="Asks (sell YES)" className="ob-no" levels={s?.asksYes ?? []} side="ask" />
      </div>
      {s?.updatedAt ? (
        <p className="muted" style={{ marginBottom: 0, marginTop: "1rem", fontSize: "0.75rem" }}>
          Updated {new Date(s.updatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
