import Decimal from "decimal.js";
import { useMemo } from "react";
import useAssetsMeta from "./useAssetsMeta";
import usePendingClaimableQuery from "./usePendingClaimableQuery";

export default function usePendingClaimable(publicKey, options = {}) {
  const pendingClaimableQuery = usePendingClaimableQuery(publicKey, options);

  const pendingClaimable = useMemo(() => {
    if (!pendingClaimableQuery.data) {
      return [];
    }
    const map = new Map();
    for (const claimable of pendingClaimableQuery.data) {
      const asset = claimable["asset"];
      const assetId =
        claimable.asset === "native"
          ? "XLM"
          : claimable.asset.replace(":", "-");

      if (map.has(assetId)) {
        const existing = map.get(assetId);
        existing.amount = existing.amount.plus(
          new Decimal(claimable["amount"])
        );
        existing.claimables.push(claimable);
        map.set(assetId, existing);
      } else {
        map.set(assetId, {
          asset,
          assetId,
          amount: new Decimal(claimable["amount"]),
          claimables: [claimable],
        });
      }
    }
    return Array.from(map.values());
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
          ["balance"]: item.amount.toFixed(7, Decimal.ROUND_DOWN),
          ["asset_id"]: item.assetId,
          ["asset_type"]: item.asset,
          ["asset_code"]:
            item.asset !== "native" ? item.asset.split(":")[0] : null,
          ["asset_issuer"]:
            item.asset !== "native" ? item.asset.split(":")[1] : null,
          ["asset_icon"]: meta?.["icon"],
          ["asset_meta"]: meta,
          ["asset_domain"]: meta?.["domain"] || meta?.["unconfirmed_domain"],
          ["transaction_name"]: item.asset,
        };
      }),
    [pendingClaimable, pendingClaimableAssetsMeta]
  );
}
