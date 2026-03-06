import type { ClaimableAsset, EnrichedBalance } from "@/types/index.d.ts";

import AssetValueMask from "@/components/AssetValueMask";

interface ClaimableAssetHeaderProps {
  asset: EnrichedBalance | ClaimableAsset;
  assetName: string;
  stakeCount: number;
}

export default function ClaimableAssetHeader({
  asset,
  assetName,
  stakeCount,
}: ClaimableAssetHeaderProps) {
  return (
    <div className="p-4 bg-slate-700 rounded-xl">
      <div className="flex gap-2 items-center">
        <img
          src={asset["asset_icon"]}
          className="size-10 shrink-0 rounded-full bg-white"
        />
        <div className="flex flex-col grow min-w-0">
          <h3 className="font-bold">{assetName}</h3>
          <p className="text-xs text-slate-400">{asset["asset_domain"]}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <p className="font-bold text-xl">
            <AssetValueMask
              prefix=""
              value={asset["balance"]}
              maskLength={10}
            />
          </p>
          <p className="text-xs text-slate-400">
            {stakeCount} stake{stakeCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
