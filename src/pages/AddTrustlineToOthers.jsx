import Alert from "@/components/Alert";
import BatchTransactionAccounts from "@/partials/BatchTransactionAccounts";
import RequiredReserve from "@/components/RequiredReserve";
import copy from "copy-to-clipboard";
import useAppStore from "@/store/useAppStore";
import useBatchTransactions from "@/hooks/useBatchTransactions";
import { IoCopyOutline } from "react-icons/io5";
import { PrimaryButton } from "@/components/Button";
import {
  createFeeBumpTransaction,
  createTrustlineTransaction,
} from "@/lib/stellar/transactions";
import { fetchAccountBalances, submit } from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function AddTrustlineToOthers() {
  const {
    account,
    accountQuery,
    accountReserveBalance,
    accountIsBelowReserve,
    asset,
    publicKey,
  } = useOutletContext();
  const pinCode = useAppStore((state) => state.pinCode);
  const list = useAppStore((state) => state.accounts);
  const otherAccounts = useMemo(
    () => list.filter((item) => item.publicKey !== publicKey),
    [list, publicKey]
  );

  const {
    activeAccounts,
    selectedAccounts,
    results,
    isProcessing,
    execute,
    toggleAccount,
    toggleAllAccounts,
  } = useBatchTransactions(otherAccounts);

  const assetName = asset["asset_name"];
  const assetCode = asset["asset_code"];
  const assetIssuer = asset["asset_issuer"];

  /** Execute Merge */
  const executeAddTrustline = async () => {
    await execute(
      async (source) => {
        /** Start Process */
        const balances = await fetchAccountBalances(source.publicKey);
        const exists = balances.some(
          (item) =>
            assetCode === item["asset_code"] &&
            assetIssuer === item["asset_issuer"]
        );

        if (!exists) {
          /** Source Transaction */
          const transaction = await createTrustlineTransaction({
            source: source.publicKey,
            assetCode,
            assetIssuer,
          });

          const signedTransaction = await signTransaction({
            keyId: source.keyId,
            transactionXDR: transaction["transaction"],
            network: transaction["network_passphrase"],
            pinCode,
          });

          /** Sponsor Transaction */
          const feeBumpTransaction = await createFeeBumpTransaction({
            sponsoringAccount: account.publicKey,
            transaction: signedTransaction,
          });

          const signedFeeBumpTransaction = await signTransaction({
            keyId: account.keyId,
            transactionXDR: feeBumpTransaction["transaction"],
            network: feeBumpTransaction["network_passphrase"],
            pinCode,
          });

          /** Submit Sponsor Transaction */
          const response = await submit(signedFeeBumpTransaction);

          return response;
        }
      },

      /** Options */
      {
        refetch: accountQuery.refetch,
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 grow min-h-0 min-w-0">
      <div className="flex flex-col gap-2">
        {/* Reserve Info */}
        <RequiredReserve
          isBelowReserve={accountIsBelowReserve}
          requiredBalance={accountReserveBalance}
        />

        {/* Merge Info */}
        <Alert variant={"warning"}>
          {otherAccounts.length > 0 ? (
            <>
              You are about to add the trustline{" "}
              <span className="font-bold">{assetName}</span> to{" "}
              <span className="font-bold">{selectedAccounts.size}</span> other
              account(s)
            </>
          ) : (
            <>No account to add to!</>
          )}
        </Alert>
      </div>

      {/* Asset */}
      <div className="p-4 flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        {/* Icon and Name */}
        <div className="flex gap-2">
          <img
            src={asset["asset_icon"]}
            className="size-10 shrink-0 rounded-full bg-white"
          />
          <div className="flex flex-col grow min-w-0">
            <h3 className="font-bold">
              {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
            </h3>
            <p className="text-xs">{asset["asset_domain"]}</p>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Asset Code */}
          <p
            className="truncate cursor-pointer"
            onClick={() => copy(asset["asset_code"])}
          >
            <IoCopyOutline className="size-4 inline-flex" />{" "}
            <span className="font-bold">Asset Code:</span> {asset["asset_code"]}
          </p>

          {/* Asset Issuer */}
          <p
            className="truncate cursor-pointer"
            onClick={() => copy(asset["asset_issuer"])}
          >
            <IoCopyOutline className="size-4 inline-flex" />{" "}
            <span className="font-bold">Asset Issuer:</span>{" "}
            <span className="truncate">{asset["asset_issuer"]}</span>
          </p>

          {/* View Asset */}
          <a
            href={`https://stellar.expert/explorer/public/asset/${asset["asset_id"]}`}
            target="_blank"
            className="text-blue-500"
          >
            View Asset
          </a>
        </div>
      </div>

      {/* Accounts List */}
      {otherAccounts.length > 0 ? (
        <>
          {/* Start Button */}
          <PrimaryButton
            onClick={executeAddTrustline}
            disabled={isProcessing || results.size > 0}
          >
            {isProcessing
              ? "Adding..."
              : results.size > 0
              ? "Added Trustline"
              : "Proceed"}
          </PrimaryButton>

          <BatchTransactionAccounts
            accounts={otherAccounts}
            selectedAccounts={selectedAccounts}
            activeAccounts={activeAccounts}
            isProcessing={isProcessing}
            results={results}
            toggleAccount={toggleAccount}
            toggleAllAccounts={toggleAllAccounts}
          />
        </>
      ) : null}
    </div>
  );
}
