import { type Chain } from "viem";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "viem/chains";

/** Chains surfaced in the wallet picker; align with where your contracts are deployed. */
export const supportedChains: [Chain, ...Chain[]] = [
  sepolia,
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
];

export function chainById(id: number): Chain | undefined {
  return supportedChains.find((c) => c.id === id);
}
