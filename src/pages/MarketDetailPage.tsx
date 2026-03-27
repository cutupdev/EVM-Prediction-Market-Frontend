import { Link, useParams } from "react-router-dom";
import { AmmTradePanel } from "@/components/trade/AmmTradePanel";
import { LimitOrderForm } from "@/components/trade/LimitOrderForm";
import { OrderbookPanel } from "@/components/orderbook/OrderbookPanel";
import { ResolveMarketPanel } from "@/components/market/ResolveMarketPanel";
import { ConfigBanner } from "@/components/ConfigBanner";
import { useMarketDetail } from "@/hooks/useMarketDetail";
import { useOrderbook } from "@/hooks/useOrderbook";
import { impliedYesPrice } from "@/lib/format";
import type { OnChainMarket } from "@/types";

export function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const marketId = id ?? "";
  const detail = useMarketDetail(marketId);
  const ob = useOrderbook(marketId);

  const m = detail.data as OnChainMarket | undefined;

  const yesPct =
    m != null ? `${(impliedYesPrice(m.yesShares, m.noShares) * 100).toFixed(1)}%` : "—";

  return (
    <>
      <ConfigBanner />
      <Link to="/" className="muted" style={{ fontSize: "0.9rem" }}>
        ← All markets
      </Link>
      <h1 className="h1" style={{ marginTop: "0.75rem" }}>
        {m?.question ?? `Market #${marketId}`}
      </h1>
      {detail.isLoading ? <p className="muted">Loading on-chain state…</p> : null}
      {detail.error ? (
        <p style={{ color: "var(--danger)" }}>{(detail.error as Error).message}</p>
      ) : null}
      {m ? (
        <div className="row" style={{ flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div className="card card-pad" style={{ flex: "1 1 200px" }}>
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Implied YES
            </div>
            <div className="price-pill" style={{ color: "var(--yes)" }}>
              {yesPct}
            </div>
          </div>
          <div className="card card-pad" style={{ flex: "1 1 200px" }}>
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Pool
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.9rem" }}>
              YES {m.yesShares.toString()}
              <br />
              NO {m.noShares.toString()}
            </div>
          </div>
          <div className="card card-pad" style={{ flex: "1 1 200px" }}>
            <div className="muted" style={{ fontSize: "0.75rem" }}>
              Status
            </div>
            <div style={{ fontWeight: 600 }}>
              {m.resolved ? `Resolved (${m.winningOutcome === 0 ? "YES" : "NO"})` : "Active"}
            </div>
            <div className="muted" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Ends {new Date(Number(m.endTime) * 1000).toLocaleString()}
            </div>
          </div>
        </div>
      ) : null}

      <div className="stack" style={{ gap: "1rem" }}>
        <OrderbookPanel snapshot={ob.data} isLoading={ob.isLoading} />
        <div className="grid-2">
          <AmmTradePanel marketId={marketId} />
          <LimitOrderForm marketId={marketId} />
        </div>
        <ResolveMarketPanel marketId={marketId} />
      </div>
    </>
  );
}
