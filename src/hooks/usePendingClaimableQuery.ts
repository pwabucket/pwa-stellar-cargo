import type { HorizonClaimableBalance } from "@/types/index.d.ts";
import type { UseQueryOptions } from "@tanstack/react-query";
import { fetchPendingClaimable } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

export default function usePendingClaimableQuery(
  publicKey?: string,
  options?: Partial<UseQueryOptions<HorizonClaimableBalance[] | null>>,
) {
  return useQuery({
    refetchInterval: 10_000,
    ...options,
    queryKey: ["pending-claimable", publicKey],
    queryFn: () =>
      publicKey
        ? (fetchPendingClaimable(publicKey).catch(() => null) as Promise<
            HorizonClaimableBalance[] | null
          >)
        : Promise.resolve(null),
  });
}
