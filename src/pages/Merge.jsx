import AccountAsset from "@/components/AccountAsset";
import Alert from "@/components/Alert";
import BatchTransactionAccounts from "@/partials/BatchTransactionAccounts";
import RequiredReserve from "@/components/RequiredReserve";
import useAppStore from "@/store/useAppStore";
import useBatchTransactions from "@/hooks/useBatchTransactions";
import { PrimaryButton } from "@/components/Button";
import {
  createFeeBumpTransaction,
  createPaymentTransaction,
} from "@/lib/stellar/transactions";
import { fetchAccountBalances, submit } from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { truncatePublicKey } from "@/lib/utils";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function Merge() {
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
    setResultValue,
    toggleAccount,
    toggleAllAccounts,
  } = useBatchTransactions(otherAccounts);

  const assetName = asset["asset_name"];
  const assetTransactionName = asset["transaction_name"];

  /** Execute Merge */
  const executeMerge = async () => {
    await execute(
      async (source) => {
        /** Start Process */
        const balances = await fetchAccountBalances(source.publicKey);
        const sourceAssetBalance = balances.find((item) =>
          asset["asset_type"] === "native"
            ? asset["asset_type"] === item["asset_type"]
            : asset["asset_issuer"] === item["asset_issuer"]
        );

        const amount = sourceAssetBalance["balance"];

        if (amount > 0) {
          /** Source Transaction */
          const transaction = await createPaymentTransaction({
            source: source.publicKey,
            destination: account.publicKey,
            asset: assetTransactionName,
            amount,
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

          /** Log Response */
          console.log(response);

          /** Set Response */
          setResultValue(source.publicKey, {
            status: true,
            response,
          });
        } else {
          /** Set Response */
          setResultValue(source.publicKey, {
            status: true,
            skipped: true,
          });
        }
      },
      /** Refetch */
      accountQuery.refetch
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
              You are about to merge{" "}
              <span className="font-bold">{assetName}</span> from{" "}
              <span className="font-bold">{selectedAccounts.size}</span> other
              account(s) into{" "}
              <span className="font-bold">
                {account.name || "Stellar Account"} (
                {truncatePublicKey(account.publicKey)})
              </span>
            </>
          ) : (
            <>No account to merge from!</>
          )}
        </Alert>
      </div>

      {/* Asset */}
      <AccountAsset asset={asset} />

      {/* Accounts List */}
      {otherAccounts.length > 0 ? (
        <>
          {/* Start Button */}
          <PrimaryButton
            onClick={executeMerge}
            disabled={isProcessing || results.size > 0}
          >
            {results.size > 0
              ? "Assets Merged"
              : isProcessing
              ? "Merging..."
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
