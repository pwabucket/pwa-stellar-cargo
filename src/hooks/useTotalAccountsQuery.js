import { fetchAccount } from "@/lib/stellar/horizonQueries";
import { useCallback } from "react";
import { useQueries } from "@tanstack/react-query";

/**
 *
 * @param {Array} accounts
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export default function useTotalAccountsQuery(accounts, options) {
  const combine = useCallback((results) => {
    return {
      query: results,
      data: results.map((result) => result.data),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
      isSuccess: results.every((result) => result.isSuccess),
    };
  }, []);

  return useQueries({
    combine,
    queries: accounts?.map((publicKey) => {
      return {
        refetchInterval: 10_000,
        ...options,
        queryKey: ["account", publicKey],
        queryFn: () => fetchAccount(publicKey),
      };
    }),
  });
}
