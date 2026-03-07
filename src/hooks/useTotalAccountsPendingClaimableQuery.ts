import type {
  CombinedQueryResult,
  HorizonClaimableBalance,
} from "@/types/index.d.ts";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { fetchPendingClaimable } from "@/lib/stellar/horizonQueries";
import { useCallback } from "react";
import useIsLoggedIn from "./useIsLoggedIn";
import { useQueries } from "@tanstack/react-query";

export default function useTotalAccountsPendingClaimableQuery(
  accounts: string[],
  options?: Partial<UseQueryOptions<HorizonClaimableBalance[] | null>>,
): CombinedQueryResult<HorizonClaimableBalance[] | null> {
  const isLoggedIn = useIsLoggedIn();
  const combine = useCallback(
    (results: UseQueryResult<HorizonClaimableBalance[] | null>[]) => {
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
        enabled: isLoggedIn,
        refetchInterval: 10_000,
        ...options,
        queryKey: ["pending-claimable", publicKey],
        queryFn: () =>
          fetchPendingClaimable(publicKey).catch(() => null) as Promise<
            HorizonClaimableBalance[] | null
          >,
      };
    }),
  });
}
