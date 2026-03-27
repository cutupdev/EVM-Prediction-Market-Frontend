import { formatUnits, parseUnits } from "viem";

export function shortAddress(addr: string, chars = 4): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, chars + 2)}…${addr.slice(-chars)}`;
}

export function formatUsdCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}k`;
  return `$${n.toFixed(2)}`;
}

export function impliedYesPrice(yesShares: bigint, noShares: bigint): number {
  const y = Number(yesShares);
  const n = Number(noShares);
  if (y + n === 0) return 0.5;
  return y / (y + n);
}

export function parseTokenAmount(input: string, decimals: number): bigint {
  const trimmed = input.trim();
  if (!trimmed) return 0n;
  return parseUnits(trimmed as `${number}`, decimals);
}

export function formatTokenAmount(value: bigint, decimals: number, maxFrac = 4): string {
  const s = formatUnits(value, decimals);
  const [whole, frac = ""] = s.split(".");
  if (!frac) return whole;
  return `${whole}.${frac.slice(0, maxFrac)}`.replace(/\.?0+$/, "");
}
