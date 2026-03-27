import { useMutation, useQueryClient } from "@tanstack/react-query";
import { predictionApi } from "@/services/api";
import type { PlaceOrderPayload } from "@/types";

export function usePlaceLimitOrder(marketId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => predictionApi.placeOrder(payload),
    onSuccess: () => {
      if (marketId) {
        void qc.invalidateQueries({ queryKey: ["orderbook", marketId] });
      }
    },
  });
}
