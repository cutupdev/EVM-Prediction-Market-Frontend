import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  usePublicClient,
} from "wagmi";
import { maxUint256 } from "viem";
import { predictionMarketAbi } from "@/abi/predictionMarket";
import { erc20Abi } from "@/abi/erc20";
import { env } from "@/config/env";
import { parseTokenAmount } from "@/lib/format";

type TxPhase = "idle" | "pending" | "confirming" | "success" | "error";

export function usePredictionActions(decimals = 6) {
  const { address: user } = useAccount();
  const publicClient = usePublicClient();
  const marketAddr =
    env.predictionMarketAddress.length === 42
      ? (env.predictionMarketAddress as `0x${string}`)
      : undefined;
  const tokenAddr =
    env.collateralTokenAddress.length === 42
      ? (env.collateralTokenAddress as `0x${string}`)
      : undefined;

  const { writeContractAsync, data: hash, isPending, error, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  const [phase, setPhase] = useState<TxPhase>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!hash) return;
    if (receipt.isSuccess) setPhase("success");
    if (receipt.isError) {
      setPhase("error");
      setLastError(receipt.error?.message ?? "Receipt error");
    }
  }, [hash, receipt.isSuccess, receipt.isError, receipt.error]);

  const allowance = useReadContract({
    address: tokenAddr,
    abi: erc20Abi,
    functionName: "allowance",
    args: user && marketAddr ? [user, marketAddr] : undefined,
    query: { enabled: Boolean(user && marketAddr && tokenAddr) },
  });

  const ensureAllowance = useCallback(
    async (min: bigint) => {
      if (!tokenAddr || !marketAddr || !user) throw new Error("Wallet or token not configured");
      const current = allowance.data ?? 0n;
      if (current >= min) return;
      setPhase("pending");
      const approveHash = await writeContractAsync({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "approve",
        args: [marketAddr, maxUint256],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }
      await allowance.refetch();
      setPhase("idle");
    },
    [allowance, marketAddr, publicClient, tokenAddr, user, writeContractAsync],
  );

  const createMarket = useCallback(
    async (question: string, endTimeSec: bigint, initialLiquidityHuman: string) => {
      if (!marketAddr) throw new Error("Set VITE_PREDICTION_MARKET_ADDRESS");
      const amount = parseTokenAmount(initialLiquidityHuman, decimals);
      setLastError(null);
      setPhase("pending");
      try {
        await ensureAllowance(amount);
        await writeContractAsync({
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "createMarket",
          args: [question, endTimeSec, amount],
        });
        setPhase("confirming");
      } catch (e) {
        setPhase("error");
        const msg = e instanceof Error ? e.message : "Transaction failed";
        setLastError(msg);
        throw e;
      }
    },
    [decimals, ensureAllowance, marketAddr, writeContractAsync],
  );

  const buyOutcome = useCallback(
    async (
      marketId: bigint,
      outcome: 0 | 1,
      collateralHuman: string,
      minSharesOut: bigint,
    ) => {
      if (!marketAddr) throw new Error("Set VITE_PREDICTION_MARKET_ADDRESS");
      const amount = parseTokenAmount(collateralHuman, decimals);
      setLastError(null);
      setPhase("pending");
      try {
        await ensureAllowance(amount);
        await writeContractAsync({
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "buyOutcome",
          args: [marketId, outcome, amount, minSharesOut],
        });
        setPhase("confirming");
      } catch (e) {
        setPhase("error");
        const msg = e instanceof Error ? e.message : "Transaction failed";
        setLastError(msg);
        throw e;
      }
    },
    [decimals, ensureAllowance, marketAddr, writeContractAsync],
  );

  const resolveMarket = useCallback(
    async (marketId: bigint, winningOutcome: 0 | 1) => {
      if (!marketAddr) throw new Error("Set VITE_PREDICTION_MARKET_ADDRESS");
      setLastError(null);
      setPhase("pending");
      try {
        await writeContractAsync({
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "resolveMarket",
          args: [marketId, winningOutcome],
        });
        setPhase("confirming");
      } catch (e) {
        setPhase("error");
        const msg = e instanceof Error ? e.message : "Transaction failed";
        setLastError(msg);
        throw e;
      }
    },
    [marketAddr, writeContractAsync],
  );

  return {
    createMarket,
    buyOutcome,
    resolveMarket,
    hash,
    isPending,
    receipt,
    error,
    phase,
    lastError,
    reset: () => {
      reset();
      setPhase("idle");
      setLastError(null);
    },
    configOk: Boolean(marketAddr && tokenAddr),
  };
}
