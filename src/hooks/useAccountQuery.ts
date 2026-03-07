import type { HorizonAccount } from "@/types/index.d.ts";
import type { UseQueryOptions } from "@tanstack/react-query";
import { fetchAccount } from "@/lib/stellar/horizonQueries";
import useIsLoggedIn from "./useIsLoggedIn";
import { useQuery } from "@tanstack/react-query";

export default function useAccountQuery(
  publicKey?: string,
  options?: Partial<UseQueryOptions<HorizonAccount | null>>,
) {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    enabled: isLoggedIn,
    refetchInterval: 10_000,
    ...options,
    queryKey: ["account", publicKey],
    queryFn: () =>
      publicKey
        ? fetchAccount(publicKey).catch(() => null)
        : Promise.resolve(null),
  });
}
