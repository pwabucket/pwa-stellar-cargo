import { fetchAssetPrice } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

export default function useAssetPriceQuery(assetCode, assetIssuer, options) {
  return useQuery({
    ...options,
    refetchInterval: 10_000,
    queryKey: ["asset", assetCode, assetIssuer],
    queryFn: () => fetchAssetPrice(assetCode, assetIssuer),
  });
}
