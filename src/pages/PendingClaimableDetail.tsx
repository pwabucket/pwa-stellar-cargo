import ClaimableAssetHeader from "@/components/ClaimableAssetHeader";
import type { ClaimableRouteContext } from "@/types/index.d.ts";
import ClaimableStakesList from "@/components/ClaimableStakesList";
import ReleaseCalculator from "@/components/ReleaseCalculator";
import useClaimableStakes from "@/hooks/useClaimableStakes";
import { useOutletContext } from "react-router";

export default function PendingClaimableDetail() {
  const { claimableAsset, publicKey } =
    useOutletContext<ClaimableRouteContext>();
  const stakes = useClaimableStakes(claimableAsset, publicKey);

  const assetName =
    claimableAsset["asset_type"] === "native"
      ? "XLM"
      : claimableAsset["asset_code"] || "Unknown Asset";

  return (
    <div className="flex flex-col gap-3">
      <ClaimableAssetHeader
        asset={claimableAsset}
        assetName={assetName}
        stakeCount={stakes.length}
      />

      <ReleaseCalculator stakes={stakes} assetName={assetName} />

      <ClaimableStakesList stakes={stakes} assetName={assetName} />
    </div>
  );
}
