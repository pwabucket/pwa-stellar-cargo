import { fetchAssetMeta } from "@/lib/stellar/stellarExpert";
import { useQuery } from "@tanstack/react-query";

export default function useAssetMetaQuery(asset, options) {
  return useQuery({
    ...options,
    queryKey: ["asset", asset, "meta"],
    queryFn: () => fetchAssetMeta(asset),
  });
}
