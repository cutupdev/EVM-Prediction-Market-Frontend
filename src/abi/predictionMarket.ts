/**
 * Minimal ABI for a constant-product style prediction market.
 * Replace or extend to match your deployed contract.
 */
export const predictionMarketAbi = [
  {
    type: "function",
    name: "createMarket",
    inputs: [
      { name: "question", type: "string" },
      { name: "endTime", type: "uint256" },
      { name: "initialLiquidity", type: "uint256" },
    ],
    outputs: [{ name: "marketId", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buyOutcome",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcome", type: "uint8" },
      { name: "collateralIn", type: "uint256" },
      { name: "minSharesOut", type: "uint256" },
    ],
    outputs: [{ name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "resolveMarket",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "winningOutcome", type: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "markets",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "question", type: "string" },
          { name: "endTime", type: "uint256" },
          { name: "resolved", type: "bool" },
          { name: "winningOutcome", type: "uint8" },
          { name: "yesShares", type: "uint256" },
          { name: "noShares", type: "uint256" },
          { name: "collateralReserve", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextMarketId",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
