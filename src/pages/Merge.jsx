import AccountAsset from "@/components/AccountAsset";
import AccountBelowReserveError from "@/components/AccountBelowReserveError";
import RequiredReserve from "@/components/RequiredReserve";
import Spinner from "@/components/Spinner";
import Toggle from "@/components/Toggle";
import useAppStore from "@/store/useAppStore";
import usePendingActivity from "@/hooks/usePendingActivity";
import useWakeLock from "@/hooks/useWakeLock";
import { BsFillSkipForwardCircleFill } from "react-icons/bs";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import { chunkArrayGenerator, cn, truncatePublicKey } from "@/lib/utils";
import {
  createFeeBumpTransaction,
  createPaymentTransaction,
} from "@/lib/stellar/transactions";
import { fetchAccountBalances, submit } from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { useCallback } from "react";
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

  const otherAccountsMapped = useMemo(
    () => otherAccounts.map((item) => [item.publicKey, item]),
    [otherAccounts]
  );

  const assetName =
    asset["asset_type"] === "native" ? "XLM" : asset["asset_code"];

  const transactionAssetName =
    asset["asset_type"] === "native"
      ? "native"
      : `${asset["asset_code"]}:${asset["asset_issuer"]}`;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState(
    new Map(otherAccountsMapped)
  );

  const [activeAccounts, setActiveAccounts] = useState(new Set());
  const [results, setResults] = useState(new Map());

  const toggleAllAccounts = useCallback(
    (checked) => {
      if (checked) {
        setSelectedAccounts(new Map(otherAccountsMapped));
      } else {
        setSelectedAccounts(new Map());
      }
    },
    [otherAccountsMapped]
  );

  const toggleAccount = useCallback((account, checked) => {
    if (checked) {
      setSelectedAccounts((prev) =>
        new Map(prev).set(account.publicKey, account)
      );
    } else {
      setSelectedAccounts((prev) => {
        const newMap = new Map(prev);
        newMap.delete(account.publicKey);
        return newMap;
      });
    }
  }, []);

  /** Execute Merge */
  const executeMerge = async () => {
    /** Reset */
    setResults(new Map());
    setActiveAccounts(new Set());
    setIsProcessing(true);

    for (const chunk of chunkArrayGenerator(otherAccounts, 5)) {
      await Promise.allSettled(
        chunk.map(async (source) => {
          if (selectedAccounts.has(source.publicKey)) {
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
              console.error(error);

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
          } else {
            /** Skip */
            setResults((prev) =>
              new Map(prev).set(source.publicKey, {
                status: true,
                skipped: true,
              })
            );
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
        <RequiredReserve balance={accountReserveBalance} />

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
        </p>
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

          {/* Accounts */}
          {results.size === 0 && !isProcessing ? (
            <label
              className={cn(
                "group rounded-xl px-3 py-2",
                "bg-neutral-100 dark:bg-neutral-800",
                "flex items-center gap-4",
                "grow min-w-0",
                "cursor-pointer select-none"
              )}
            >
              <Toggle
                checked={selectedAccounts.size === otherAccounts.length}
                onChange={(ev) => toggleAllAccounts(ev.target.checked)}
              />

              {/* Account Name */}
              <h4 className="font-bold truncate grow min-w-0">
                Toggle Accounts
              </h4>
            </label>
          ) : null}

          <div className="flex flex-col gap-2">
            {otherAccounts.map((source) => (
              <div key={source.keyId} className="flex items-center gap-2">
                <label
                  className={cn(
                    "group rounded-xl px-3 py-2",
                    "bg-neutral-100 dark:bg-neutral-800",
                    "flex items-center gap-4",
                    "grow min-w-0",
                    "cursor-pointer select-none"
                  )}
                >
                  {/* Indicator */}
                  {results.has(source.publicKey) ? (
                    results.get(source.publicKey).status ? (
                      results.get(source.publicKey).skipped ? (
                        <BsFillSkipForwardCircleFill className="size-5 text-yellow-500" />
                      ) : (
                        <HiCheckCircle className="text-green-500 size-5" />
                      )
                    ) : (
                      <HiXCircle className="text-red-500 size-5" />
                    )
                  ) : isProcessing ? (
                    activeAccounts.has(source.publicKey) ? (
                      <Spinner />
                    ) : (
                      <HiClock className="size-4" />
                    )
                  ) : (
                    <Toggle
                      checked={selectedAccounts.has(source.publicKey)}
                      onChange={(ev) =>
                        toggleAccount(source, ev.target.checked)
                      }
                    />
                  )}

                  {/* Account Name */}
                  <h4 className="font-bold truncate grow min-w-0">
                    {source.name || "Stellar Account"}
                  </h4>

                  {/* Account Public Key */}
                  <p className={cn("truncate", "text-xs text-blue-500")}>
                    {truncatePublicKey(source.publicKey)}
                  </p>
                </label>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
