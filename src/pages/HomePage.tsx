import { ConfigBanner } from "@/components/ConfigBanner";
import { CreateMarketForm } from "@/components/market/CreateMarketForm";
import { MarketCard } from "@/components/market/MarketCard";
import { useMergedMarkets } from "@/hooks/useMergedMarkets";

export function HomePage() {
  const { merged, isLoading, error } = useMergedMarkets();

  return (
    <>
      <ConfigBanner />
      <h1 className="h1">Markets</h1>
      <p className="muted" style={{ marginTop: 0, maxWidth: "62ch" }}>
        Browse prediction markets with on-chain AMM liquidity and an off-chain limit order book. Data
        merges RPC reads with your indexer when <code>VITE_API_BASE_URL</code> is set (or dev proxy{" "}
        <code>/api</code>).
      </p>
      <div className="split-panels" style={{ marginTop: "1.25rem" }}>
        <div className="stack">
          {isLoading ? <p className="muted">Loading markets…</p> : null}
          {error ? (
            <p className="muted" style={{ color: "var(--danger)" }}>
              RPC error: {(error as Error).message}
            </p>
          ) : null}
          {!isLoading && merged.length === 0 ? (
            <div className="card card-pad">
              <p className="muted" style={{ margin: 0 }}>
                No markets yet. Deploy the contract, set env addresses, then create a market below.
              </p>
            </div>
          ) : (
            <div className="market-grid">
              {merged.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          )}
        </div>
        <CreateMarketForm />
      </div>
    </>
  );
}
