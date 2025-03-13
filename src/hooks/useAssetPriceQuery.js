import { fetchAssetPrice } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param {string} assetCode
 * @param {string} assetIssuer
 * @param {string} amount
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export default function useAssetPriceQuery(
  assetCode,
  assetIssuer,
  amount,
  options
) {
  return useQuery({
    refetchInterval: 10_000,
    ...options,
    queryKey: ["asset", assetCode, assetIssuer, amount],
    queryFn: () => fetchAssetPrice(assetCode, assetIssuer, amount),
  });
}
