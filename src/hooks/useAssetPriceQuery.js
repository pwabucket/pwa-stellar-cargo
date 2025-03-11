import { fetchAssetPrice } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

export default function useAssetPriceQuery(
  assetCode,
  assetIssuer,
  amount,
  options
) {
  return useQuery({
    ...options,
    refetchInterval: 10_000,
    queryKey: ["asset", assetCode, assetIssuer, amount],
    queryFn: () => fetchAssetPrice(assetCode, assetIssuer, amount),
  });
}
