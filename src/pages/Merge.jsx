import AccountAsset from "@/components/AccountAsset";
import Alert from "@/components/Alert";
import BatchTransactionAccounts from "@/partials/BatchTransactionAccounts";
import RequiredReserve from "@/components/RequiredReserve";
import TransactionsFee from "@/components/TransactionsFee";
import useAppStore from "@/store/useAppStore";
import useBatchTransactions from "@/hooks/useBatchTransactions";
import { PrimaryButton } from "@/components/Button";
import {
  calculateAssetMaxAmount,
  calculateXLMReserve,
  truncatePublicKey,
} from "@/lib/utils";
import {
  createFeeBumpTransaction,
  createPaymentTransaction,
} from "@/lib/stellar/transactions";
import { fetchAccount, submit } from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
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
        const sourceAccount = await fetchAccount(source.publicKey);
        const sourceAsset = sourceAccount["balances"].find(
          (item) =>
            item["asset_code"] === asset["asset_code"] &&
            item["asset_issuer"] === asset["asset_issuer"]
        );

        const reservedXLM = calculateXLMReserve(sourceAccount);
        const amount = calculateAssetMaxAmount(sourceAsset, reservedXLM, 0);

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

        {/* Fee */}
        <TransactionsFee count={selectedAccounts.size} />

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
            {isProcessing
              ? "Merging..."
              : results.size > 0
              ? "Assets Merged"
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
