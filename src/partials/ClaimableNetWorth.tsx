import type { ClaimableAsset, NetWorthAsset } from "@/types/index.d.ts";

import ClaimableDetailDialog from "@/components/ClaimableDetailDialog";
import NetWorthList from "./NetWorthList";
import type { ReactNode } from "react";
import useLocationToggle from "@/hooks/useLocationToggle";
import usePendingClaimableNetWorth from "@/hooks/usePendingClaimableNetWorth";
import { useState } from "react";

export default function ClaimableNetWorth() {
  const { isSuccess, assets, totalNetWorth } = usePendingClaimableNetWorth();
  const [open, onOpenChange] = useLocationToggle("__showClaimableDetail");
  const [selectedAsset, setSelectedAsset] = useState<NetWorthAsset | null>(
    null,
  );

  function renderClaimableItem(
    item: NetWorthAsset,
    content: ReactNode,
  ): ReactNode {
    if (!item["claimables"]?.length) return content;

    return (
      <button
        key={item["asset_id"]}
        className="text-left w-full"
        onClick={() => {
          setSelectedAsset(item);
          onOpenChange(true);
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <>
      <NetWorthList
        isSuccess={isSuccess}
        assets={assets}
        totalNetWorth={totalNetWorth}
        renderItem={renderClaimableItem}
      />

      {selectedAsset && (
        <ClaimableDetailDialog
          asset={selectedAsset as ClaimableAsset}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
}
