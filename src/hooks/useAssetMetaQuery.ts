import type { AssetMeta } from "@/types/index.d.ts";
import type { UseQueryOptions } from "@tanstack/react-query";
import { fetchAssetMeta } from "@/lib/stellar/stellarExpert";
import useIsLoggedIn from "./useIsLoggedIn";
import { useQuery } from "@tanstack/react-query";

export default function useAssetMetaQuery(
  asset: string | string[],
  options?: Partial<UseQueryOptions<AssetMeta[]>>,
) {
  const isLoggedIn = useIsLoggedIn();
  return useQuery({
    enabled: isLoggedIn,
    ...options,
    queryKey: ["asset", asset, "meta"],
    queryFn: () => fetchAssetMeta(asset),
  });
}
