import ClaimableAssetHeader from "@/components/ClaimableAssetHeader";
import type { ClaimableRouteContext } from "@/types/index.d.ts";
import ClaimableStakesList from "@/components/ClaimableStakesList";
import ReleaseCalculator from "@/components/ReleaseCalculator";
import { SecondaryButton } from "@/components/Button";
import { createClaimBalancesTransaction } from "@/lib/stellar/transactions";
import { isAfter } from "date-fns";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import toast from "react-hot-toast";
import useAppStore from "@/store/useAppStore";
import useClaimableStakes from "@/hooks/useClaimableStakes";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router";

export default function PendingClaimableDetail() {
  const pinCode = useAppStore((state) => state.pinCode);
  const { account, claimableAsset, publicKey } =
    useOutletContext<ClaimableRouteContext>();
  const stakes = useClaimableStakes(claimableAsset, publicKey);

  const assetName =
    claimableAsset["asset_type"] === "native"
      ? "XLM"
      : claimableAsset["asset_code"] || "Unknown Asset";

  const availableStakes = useMemo(
    () =>
      stakes.filter((item) => {
        const releaseDate = item.releaseDate
          ? new Date(item.releaseDate)
          : null;
        const canClaim = releaseDate ? isAfter(new Date(), releaseDate) : true;

        return canClaim;
      }),
    [stakes],
  );

  const mutation = useMutation({
    mutationKey: [publicKey, "asset", "claim-all"],
    mutationFn: async () => {
      const transaction = await createClaimBalancesTransaction({
        source: account.publicKey,
        balances: availableStakes,
      });

      const signedTransaction = await signTransaction({
        keyId: account.keyId,
        transactionXDR: transaction["transaction"],
        network: transaction["network_passphrase"],
        pinCode,
      });

      /** Submit Transaction */
      const response = await submit(signedTransaction);

      /** Log Response */
      console.log(response);

      return response;
    },
  });

  const handleClaimAll = async () => {
    await toast.promise(mutation.mutateAsync(), {
      loading: "Claiming...",
      error: "Failed to claim",
      success: "Successfully claimed balances.",
    });
  };

  console.log("Available Stakes", availableStakes);

  return (
    <div className="flex flex-col gap-3">
      <ClaimableAssetHeader
        asset={claimableAsset}
        assetName={assetName}
        stakeCount={stakes.length}
      />

      {availableStakes.length ? (
        <SecondaryButton onClick={handleClaimAll}>
          {mutation.isPending
            ? "Claiming..."
            : `Claim All (${availableStakes.length})`}
        </SecondaryButton>
      ) : null}

      <ReleaseCalculator stakes={stakes} assetName={assetName} />

      <ClaimableStakesList stakes={stakes} assetName={assetName} />
    </div>
  );
}
