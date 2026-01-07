import { getClaimableAssets } from "@/lib/utils";
import { useMemo } from "react";
import useAssetsMeta from "./useAssetsMeta";
import usePendingClaimableQuery from "./usePendingClaimableQuery";

export default function usePendingClaimable(publicKey, options = {}) {
  const pendingClaimableQuery = usePendingClaimableQuery(publicKey, options);

  const pendingClaimable = useMemo(() => {
    if (!pendingClaimableQuery.data) {
      return [];
    }

    return getClaimableAssets(pendingClaimableQuery.data);
  }, [pendingClaimableQuery.data]);

  const pendingClaimableAssetIds = useMemo(() => {
    return pendingClaimable.map((item) => item.assetId);
  }, [pendingClaimable]);

  const pendingClaimableAssetsMeta = useAssetsMeta(pendingClaimableAssetIds);

  return useMemo(
    () =>
      pendingClaimable.map((item) => {
        const meta = pendingClaimableAssetsMeta?.[item.assetId];

        return {
          ...item,
          ["asset_icon"]: meta?.["icon"],
          ["asset_meta"]: meta,
          ["asset_domain"]: meta?.["domain"] || meta?.["unconfirmed_domain"],
        };
      }),
    [pendingClaimable, pendingClaimableAssetsMeta]
  );
}
