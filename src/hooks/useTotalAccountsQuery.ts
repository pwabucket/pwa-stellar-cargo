import type { CombinedQueryResult, HorizonAccount } from "@/types/index.d.ts";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { fetchAccount } from "@/lib/stellar/horizonQueries";
import { useCallback } from "react";
import { useQueries } from "@tanstack/react-query";

export default function useTotalAccountsQuery(
  accounts: string[],
  options?: Partial<UseQueryOptions<HorizonAccount | null>>,
): CombinedQueryResult<HorizonAccount | null> {
  const combine = useCallback(
    (results: UseQueryResult<HorizonAccount | null>[]) => {
      return {
        query: results,
        data: results.map((result) => result.data),
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
        isSuccess:
          results.length > 0 && results.every((result) => result.isSuccess),
      };
    },
    [],
  );

  return useQueries({
    combine,
    queries: (accounts ?? []).map((publicKey) => {
      return {
        refetchInterval: 10_000,
        ...options,
        queryKey: ["account", publicKey],
        queryFn: () => fetchAccount(publicKey).catch(() => null),
      };
    }),
  });
}
