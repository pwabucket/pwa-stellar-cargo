import AccountBelowReserveError from "@/components/AccountBelowReserveError";
import Spinner from "@/components/Spinner";
import useAppStore from "@/store/useAppStore";
import usePendingActivity from "@/hooks/usePendingActivity";
import useWakeLock from "@/hooks/useWakeLock";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import { chunkArrayGenerator, cn, truncatePublicKey } from "@/lib/utils";
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
  const [activeAccounts, setActiveAccounts] = useState(new Set());
  const [results, setResults] = useState(new Map());

  /** Execute Merge */
  const executeMerge = async () => {
    /** Reset */
    setResults(new Map());
    setActiveAccounts(new Set());
    setIsProcessing(true);

    for (const chunk of chunkArrayGenerator(otherAccounts, 5)) {
      await Promise.allSettled(
        chunk.map(async (source) => {
          try {
            /** Mark as Active */
            setActiveAccounts((prev) => new Set(prev).add(source.publicKey));

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
              setResults((prev) =>
                new Map(prev).set(source.publicKey, {
                  status: true,
                  balance: sourceAssetBalance,
                  response,
                })
              );
            } else {
              /** Set Response */
              setResults((prev) =>
                new Map(prev).set(source.publicKey, {
                  status: true,
                  skipped: true,
                })
              );
            }
          } catch (error) {
            /** Log Error */
            console.log(error);

            /** Set Error */
            setResults((prev) =>
              new Map(prev).set(source.publicKey, {
                status: false,
                error,
              })
            );
          } finally {
            /** Remove from Processing */
            setActiveAccounts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(source.publicKey);
              return newSet;
            });
          }
        })
      );
    }

    try {
      /** Refetch */
      await accountQuery.refetch();
    } catch (e) {
      console.warn("Failed to Refetch Balances");
      console.error(e);
    }

    /** Stop Processing */
    setIsProcessing(false);
  };

  /** Acquire WakeLock */
  useWakeLock(isProcessing);

  /** Prevent Automatic Logout */
  usePendingActivity(isProcessing);

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
          <AccountBelowReserveError
            accountReserveBalance={accountReserveBalance}
          />
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
                {results.has(source.publicKey) ? (
                  results.get(source.publicKey).status ? (
                    <HiCheckCircle
                      className={cn(
                        results.get(source.publicKey).skipped
                          ? "text-orange-500"
                          : "text-green-500",
                        "size-5"
                      )}
                    />
                  ) : (
                    <HiXCircle className="text-red-500 size-5" />
                  )
                ) : isProcessing ? (
                  activeAccounts.has(source.publicKey) ? (
                    <Spinner />
                  ) : (
                    <HiClock className="size-5" />
                  )
                ) : null}

                {/* Account Name */}
                <h4 className="font-bold truncate grow min-w-0">
                  {source.name || "Stellar Account"}
                </h4>

                {/* Account Public Key */}
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
