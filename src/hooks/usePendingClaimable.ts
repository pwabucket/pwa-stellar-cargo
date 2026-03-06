import type { ClaimableAsset } from "@/types/index.d.ts";
import { getClaimableAssets } from "@/lib/utils";
import useAssetsMeta from "./useAssetsMeta";
import { useMemo } from "react";
import usePendingClaimableQuery from "./usePendingClaimableQuery";

export default function usePendingClaimable(
  publicKey?: string,
  options: Record<string, unknown> = {},
): ClaimableAsset[] {
  const pendingClaimableQuery = usePendingClaimableQuery(publicKey, options);

  const pendingClaimable = useMemo(() => {
    if (!pendingClaimableQuery.data) {
      return [];
    }

    return getClaimableAssets(pendingClaimableQuery.data);
  }, [pendingClaimableQuery.data]);

  const pendingClaimableAssetIds = useMemo(() => {
    return pendingClaimable.map((item) => item["asset_id"]);
  }, [pendingClaimable]);

  const pendingClaimableAssetsMeta = useAssetsMeta(pendingClaimableAssetIds);

  return useMemo(
    () =>
      pendingClaimable.map((item) => {
        const meta = pendingClaimableAssetsMeta?.[item["asset_id"]];

        return {
          ...item,
          ["asset_icon"]: meta?.["icon"],
          ["asset_meta"]: meta,
          ["asset_domain"]: meta?.["domain"] || meta?.["unconfirmed_domain"],
        };
      }),
    [pendingClaimable, pendingClaimableAssetsMeta],
  );
}
