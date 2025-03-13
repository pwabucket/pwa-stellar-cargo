import { fetchAccount } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param {string} publicKey
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export default function useAccountQuery(publicKey, options) {
  return useQuery({
    refetchInterval: 10_000,
    ...options,
    queryKey: ["account", publicKey],
    queryFn: () => fetchAccount(publicKey),
  });
}
