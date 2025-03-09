import Spinner from "@/components/Spinner";
import useAppStore from "@/store/useAppStore";
import useWakeLock from "@/hooks/useWakeLock";
import cn, { truncatePublicKey } from "@/lib/utils";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import {
  createFeeBumpTransaction,
  createPaymentTransaction,
} from "@/lib/stellar/transactions";
import { fetchAccountBalances, submit } from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { useMemo } from "react";
import { useOutletContext } from "react-router";
import { useState } from "react";

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

  const assetName =
    asset["asset_type"] === "native" ? "XLM" : asset["asset_code"];

  const transactionAssetName =
    asset["asset_type"] === "native"
      ? "native"
      : `${asset["asset_code"]}:${asset["asset_issuer"]}`;

  const [isProcessing, setIsProcessing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [results, setResults] = useState({});

  /** Execute Merge */
  const executeMerge = async () => {
    /** Reset */
    setResults({});
    setCurrent(null);
    setIsProcessing(true);

    for (const source of otherAccounts) {
      try {
        setCurrent(source.publicKey);
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
            asset: transactionAssetName,
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
          setResults((prev) => ({
            ...prev,
            [source.publicKey]: {
              status: true,
              balance: sourceAssetBalance,
              response,
            },
          }));
        } else {
          /** Set Response */
          setResults((prev) => ({
            ...prev,
            [source.publicKey]: {
              status: true,
              skipped: true,
            },
          }));
        }
      } catch (error) {
        /** Log Error */
        console.log(error);

        /** Set Error */
        setResults((prev) => ({
          ...prev,
          [source.publicKey]: {
            status: false,
            error,
          },
        }));
      }
    }

    /** Refetch */
    await accountQuery.refetch();

    /** Stop Processing */
    setIsProcessing(false);
  };

  /** Acquire WakeLock */
  useWakeLock(isProcessing);

  return (
    <div className="flex flex-col gap-4 grow min-h-0 min-w-0">
      <div className="flex flex-col gap-2">
        {/* Reserve Info */}
        <p
          className={cn(
            "p-2 text-center rounded-xl",
            "text-blue-800 bg-blue-100"
          )}
        >
          Required Reserve:{" "}
          <span className="font-bold">{accountReserveBalance} XLM</span>
        </p>

        {/* Below Reserve info */}
        {accountIsBelowReserve ? (
          <p
            className={cn(
              "p-2 text-center rounded-xl",
              "text-red-800 bg-red-100"
            )}
          >
            Account is below reserve! Transactions are likely to fail. You need
            a minimum of{" "}
            <span className="font-bold">{accountReserveBalance} XLM</span> +
            transaction fees.
          </p>
        ) : null}

        {/* Merge Info */}
        <p
          className={cn(
            "p-2 text-center rounded-xl",
            "text-yellow-800 bg-yellow-100"
          )}
        >
          {otherAccounts.length >= 1 ? (
            <>
              You are about to merge{" "}
              <span className="font-bold">{assetName}</span> from{" "}
              <span className="font-bold">{otherAccounts.length}</span> other
              account(s) into{" "}
              <span className="font-bold">
                {account.name || "Stellar Account"} (
                {truncatePublicKey(account.publicKey)})
              </span>
            </>
          ) : (
            <>No account to merge from!</>
          )}
        </p>
      </div>

      {/* Accounts List */}
      {otherAccounts.length >= 1 ? (
        <>
          {/* Start Button */}
          <PrimaryButton onClick={executeMerge} disabled={isProcessing}>
            {isProcessing ? "Merging..." : "Proceed"}
          </PrimaryButton>

          {/* Accounts */}
          <div className="flex flex-col gap-2">
            {otherAccounts.map((source) => (
              <div
                key={source.keyId}
                className={cn(
                  "group rounded-xl px-3 py-2",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "flex items-center gap-2"
                )}
              >
                {/* Indicator */}
                {results[source.publicKey] ? (
                  results[source.publicKey]["status"] ? (
                    <HiCheckCircle className="text-green-500 size-5" />
                  ) : (
                    <HiXCircle className="text-red-500 size-5" />
                  )
                ) : isProcessing ? (
                  current == source.publicKey ? (
                    <Spinner />
                  ) : (
                    <HiClock className="size-5" />
                  )
                ) : null}

                <h4 className="font-bold truncate grow min-w-0">
                  {source.name || "Stellar Account"}
                </h4>
                <p className={cn("truncate", "text-xs text-blue-500")}>
                  {truncatePublicKey(source.publicKey)}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
