/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREDICTION_MARKET_ADDRESS: string;
  readonly VITE_COLLATERAL_TOKEN_ADDRESS: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_DEFAULT_CHAIN_ID: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_WS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
