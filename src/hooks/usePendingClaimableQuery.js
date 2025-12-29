import { fetchPendingClaimable } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param {string} publicKey
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export default function usePendingClaimableQuery(publicKey, options) {
  return useQuery({
    refetchInterval: 10_000,
    ...options,
    queryKey: ["pending-claimable", publicKey],
    queryFn: () => fetchPendingClaimable(publicKey).catch(() => null),
  });
}
