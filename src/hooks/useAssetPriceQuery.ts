import type Decimal from "decimal.js";
import type { UseQueryOptions } from "@tanstack/react-query";
import { fetchAssetPrice } from "@/lib/stellar/horizonQueries";
import useIsLoggedIn from "./useIsLoggedIn";
import { useQuery } from "@tanstack/react-query";

export default function useAssetPriceQuery(
  assetCode: string,
  assetIssuer: string,
  amount: Decimal.Value,
  options?: Partial<UseQueryOptions<string | null>>,
) {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    enabled: isLoggedIn,
    refetchInterval: 10_000,
    ...options,
    queryKey: ["asset", assetCode, assetIssuer, amount],
    queryFn: () => fetchAssetPrice(assetCode, assetIssuer, amount),
  });
}
