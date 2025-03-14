import AccountAsset from "@/components/AccountAsset";
import Alert from "@/components/Alert";
import BatchTransactionAccounts from "@/partials/BatchTransactionAccounts";
import RequiredReserve from "@/components/RequiredReserve";
import useAppStore from "@/store/useAppStore";
import useBatchTransactions from "@/hooks/useBatchTransactions";
import { PrimaryButton } from "@/components/Button";
import { createPaymentTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import { truncatePublicKey } from "@/lib/utils";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function Split() {
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

  const splitAmount = asset["balance"] / (selectedAccounts.size + 1);

  /** Execute Split */
  const executeSplit = async () => {
    await execute(
      async (destination) => {
        /** Get Amount */
        const amount = splitAmount;

        if (amount > 0) {
          /** Source Transaction */
          const transaction = await createPaymentTransaction({
            source: account.publicKey,
            destination: destination.publicKey,
            asset: assetTransactionName,
            amount,
          });

          const signedTransaction = await signTransaction({
            keyId: account.keyId,
            transactionXDR: transaction["transaction"],
            network: transaction["network_passphrase"],
            pinCode,
          });

          /** Submit Sponsor Transaction */
          const response = await submit(signedTransaction);

          /** Log Response */
          console.log(response);

          /** Set Response */
          setResultValue(destination.publicKey, {
            status: true,
            response,
          });
        } else {
          /** Set Response */
          setResultValue(destination.publicKey, {
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

        {/* Split Info */}
        <Alert variant={"warning"}>
          {otherAccounts.length > 0 ? (
            <>
              You are about to split{" "}
              <span className="font-bold">{assetName}</span> equally among{" "}
              <span className="font-bold">{selectedAccounts.size}</span>{" "}
              account(s) from{" "}
              <span className="font-bold">
                {account.name || "Stellar Account"} (
                {truncatePublicKey(account.publicKey)})
              </span>
            </>
          ) : (
            <>No account to split into!</>
          )}
        </Alert>
      </div>

      {/* Asset */}
      <AccountAsset asset={asset} />

      {/* Amount */}
      <p className="text-center text-sm">
        Split: <span className="font-bold">{splitAmount}</span>
      </p>

      {/* Accounts List */}
      {otherAccounts.length > 0 ? (
        <>
          {/* Start Button */}
          <PrimaryButton
            onClick={executeSplit}
            disabled={isProcessing || results.size > 0}
          >
            {results.size > 0
              ? "Asset Splitted"
              : isProcessing
              ? "Splitting..."
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
