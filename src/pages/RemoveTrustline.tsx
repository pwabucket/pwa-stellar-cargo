import type { AssetRouteContext } from "@/types/index.d.ts";
import AccountAsset from "@/components/AccountAsset";
import Alert from "@/components/Alert";
import Decimal from "decimal.js";
import { HiOutlineTrash } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import TransactionsFee from "@/components/TransactionsFee";
import { createRemoveTrustlineTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import useAppStore from "@/store/useAppStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router";

export default function RemoveTrustline() {
  const { account, asset, accountQuery } =
    useOutletContext<AssetRouteContext>();
  const pinCode = useAppStore((state) => state.pinCode);
  const navigate = useNavigate();

  const isNative = asset["asset_type"] === "native";
  const hasBalance = new Decimal(asset["balance"] || 0).greaterThan(0);
  const canRemove = !isNative && !hasBalance;

  const mutation = useMutation({
    mutationKey: [account.publicKey, "trustline", "remove", asset["asset_id"]],
    mutationFn: async () => {
      const transaction = await createRemoveTrustlineTransaction({
        source: account.publicKey,
        assetCode: asset["asset_code"]!,
        assetIssuer: asset["asset_issuer"]!,
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

  const handleRemove = async () => {
    try {
      await mutation.mutateAsync();
      await accountQuery.refetch();
      /** Asset no longer exists, go back to the account */
      navigate(`/accounts/${account.publicKey}`, { replace: true });
    } catch (error) {
      console.warn("Error - Removing Trustline");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Asset */}
      <AccountAsset asset={asset} />

      {isNative ? (
        <Alert variant={"warning"}>
          The native XLM asset does not have a trustline to remove.
        </Alert>
      ) : hasBalance ? (
        <Alert variant={"warning"}>
          You must have a zero balance before removing this trustline. Send or
          merge out the remaining{" "}
          <span className="font-bold">{asset["asset_code"]}</span> first.
        </Alert>
      ) : (
        <Alert variant={"warning"}>
          You are about to remove the{" "}
          <span className="font-bold">{asset["asset_code"]}</span> trustline.
          This frees up the reserved XLM held for it.
        </Alert>
      )}

      <TransactionsFee />

      <PrimaryButton
        onClick={handleRemove}
        disabled={!canRemove || mutation.isPending}
      >
        <HiOutlineTrash className="size-5" />
        {mutation.isPending ? "Removing..." : "Remove Trustline"}
      </PrimaryButton>

      {mutation.isError ? (
        <p className="text-center text-red-500">Failed to Remove Trustline</p>
      ) : null}
    </div>
  );
}
