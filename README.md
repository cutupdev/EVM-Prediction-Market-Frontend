# EVM Prediction Market — Frontend

React + TypeScript client for a prediction market on EVM chains. It combines **on-chain AMM-style trading** (Wagmi/Viem + RainbowKit) with an **off-chain limit order book** served by your backend, plus optional **WebSocket** updates for depth.

## Stack

- **Vite 6** — dev server and production build
- **React 18** — UI
- **TypeScript** — strict typing end-to-end
- **Wagmi 2 + Viem** — contract reads/writes, multicall batching for market lists
- **RainbowKit** — wallet connection (WalletConnect v2 project id required for mobile wallets)
- **TanStack Query** — server state (order book, indexer, mutations)

## Features

| Area | What is implemented |
|------|---------------------|
| **UI/UX** | Dark theme, responsive market grid, market detail with pool stats, order book tables, AMM trade form, limit order form, create/resolve panels |
| **Contracts** | Typed ABI in `src/abi/predictionMarket.ts` (`createMarket`, `buyOutcome`, `resolveMarket`, `markets`, `nextMarketId`) + ERC20 `approve` / `allowance` |
| **Backend** | `src/services/api.ts` — `health`, `listMarkets`, `getOrderbook`, `placeOrder`, `cancelOrder`, `listMyOrders` |
| **Order book** | `useOrderbook` — polling + optional `VITE_API_WS_URL` push refresh |
| **Data merge** | `useMergedMarkets` — unions on-chain RPC markets with indexer metadata when the API returns data |

Replace or extend the ABI to match your real deployment (Gnosis CTF, custom LMSR, etc.).

## Getting started

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Fill in at least:

   - `VITE_WALLETCONNECT_PROJECT_ID` — from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - `VITE_PREDICTION_MARKET_ADDRESS` — deployed market contract (42-char `0x…`)
   - `VITE_COLLATERAL_TOKEN_ADDRESS` — ERC20 used as collateral

3. Install and run (when you are ready — not run in this template delivery):

   ```bash
   npm install
   npm run dev
   ```

4. Production build:

   ```bash
   npm run build
   npm run preview
   ```

## Environment variables

See `.env.example` for all keys. Vite only exposes variables prefixed with `VITE_`.

- **`VITE_API_BASE_URL`** — If empty, the app calls same-origin `/api/...`. The included Vite config proxies `/api` to `http://localhost:4000` during development.
- **`VITE_API_WS_URL`** — If set, `useOrderbook` opens a WebSocket and expects JSON messages shaped like `OrderbookSnapshot` (see `src/types/index.ts`).

## Backend API shapes (reference)

Your service should implement routes compatible with `predictionApi` in `src/services/api.ts`:

- `GET /health` → `{ ok: boolean, version?: string }`
- `GET /markets` → `MarketSummary[]`
- `GET /markets/:id/orderbook` → `OrderbookSnapshot`
- `POST /orders` → accepts `PlaceOrderPayload`, returns `ApiOrder`
- `DELETE /orders/:id` → `{ ok: boolean }`
- `GET /orders?maker=0x…` → `ApiOrder[]`

Adjust paths or add auth headers in `api.ts` to match your stack.

## Smart contract assumptions

The template ABI assumes:

- `nextMarketId` is the **count** of markets, with ids in `[0 .. nextMarketId - 1]` (common for simple registries). If your contract uses `1..n` ids or a different enumerator, update `useOnChainMarkets` accordingly.
- Outcome encoding: **`0` = YES**, **`1` = NO** in `buyOutcome` / `resolveMarket`.
- Collateral is ERC20 with **decimals** defaulted to `6` in `usePredictionActions` / trade forms — change the hook parameter to match USDC (6), WETH (18), etc.

## Project layout

```
src/
  abi/           Contract ABIs (Viem `as const`)
  components/    UI building blocks (order book, trade, layout)
  config/        Chains + env helpers
  hooks/         Wagmi + React Query hooks
  lib/           Formatting / small pure helpers
  pages/         Routed screens
  providers/     Wagmi + RainbowKit + QueryClient
  services/      REST client for order book & indexer
  types/         Shared DTOs
```

## Contact Information

- Telegram: https://t.me/DevCutup
- Twitter: https://x.com/devcutup
