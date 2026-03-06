import type { CombinedQueryResult, EnrichedBalance } from "@/types/index.d.ts";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { fetchAssetPrice } from "@/lib/stellar/horizonQueries";
import { useCallback } from "react";
import { useQueries } from "@tanstack/react-query";

export default function useTotalAssetsPriceQuery(
  assets: EnrichedBalance[],
  options?: Partial<UseQueryOptions<string | null>>,
): CombinedQueryResult<string | null> {
  const combine = useCallback((results: UseQueryResult<string | null>[]) => {
    return {
      query: results,
      data: results.map((result) => result.data),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
      isSuccess:
        results.length > 0 && results.every((result) => result.isSuccess),
    };
  }, []);

  return useQueries({
    combine,
    queries: (assets ?? []).map((asset) => {
      const assetCode =
        asset?.["asset_type"] === "native"
          ? "XLM"
          : asset?.["asset_code"] || "";
      const assetIssuer = asset?.["asset_issuer"] || "";
      const amount = asset?.["balance"];

      return {
        refetchInterval: 10000,
        ...options,
        queryKey: ["asset", assetCode, assetIssuer, amount],
        queryFn: () => fetchAssetPrice(assetCode, assetIssuer, amount),
      };
    }),
  });
}
