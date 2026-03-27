import { hasContractConfig } from "@/config/env";

export function ConfigBanner() {
  if (hasContractConfig()) return null;
  return (
    <div className="banner" role="status">
      Set <code>VITE_PREDICTION_MARKET_ADDRESS</code> (and collateral token) in <code>.env</code> to
      enable on-chain reads and trades. Copy from <code>.env.example</code>.
    </div>
  );
}
