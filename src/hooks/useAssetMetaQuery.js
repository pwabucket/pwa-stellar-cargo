import { fetchAssetMeta } from "@/lib/stellar/stellarExpert";
import { useQuery } from "@tanstack/react-query";

/**
 *
 * @param {string} asset
 * @param {import("@tanstack/react-query").UseQueryOptions} options
 * @returns
 */
export default function useAssetMetaQuery(asset, options) {
  return useQuery({
    ...options,
    queryKey: ["asset", asset, "meta"],
    queryFn: () => fetchAssetMeta(asset),
  });
}
