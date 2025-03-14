import { chunkArrayGenerator } from "@/lib/utils";
import { useCallback } from "react";
import { useMemo } from "react";
import { useState } from "react";

import usePendingActivity from "./usePendingActivity";
import useWakeLock from "./useWakeLock";

export default function useBatchTransactions(accounts) {
  const accountsMapped = useMemo(
    () => accounts.map((item) => [item.publicKey, item]),
    [accounts]
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState(
    new Map(accountsMapped)
  );

  const [activeAccounts, setActiveAccounts] = useState(new Set());
  const [results, setResults] = useState(new Map());

  const setResultValue = useCallback((publicKey, data) => {
    setResults((prev) => new Map(prev).set(publicKey, data));
  }, []);

  const toggleAllAccounts = useCallback(
    (checked) => {
      if (checked) {
        setSelectedAccounts(new Map(accountsMapped));
      } else {
        setSelectedAccounts(new Map());
      }
    },
    [accountsMapped]
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

  /** Execute */
  const execute = useCallback(
    async (callback, refetch) => {
      /** Reset */
      setResults(new Map());
      setActiveAccounts(new Set());
      setIsProcessing(true);

      for (const chunk of chunkArrayGenerator(accounts, 5)) {
        await Promise.allSettled(
          chunk.map(async (destination) => {
            if (selectedAccounts.has(destination.publicKey)) {
              try {
                /** Mark as Active */
                setActiveAccounts((prev) =>
                  new Set(prev).add(destination.publicKey)
                );

                await callback(destination);
              } catch (error) {
                /** Log Error */
                console.error(error);

                /** Set Error */
                setResultValue(destination.publicKey, {
                  status: false,
                  error,
                });
              } finally {
                /** Remove from Processing */
                setActiveAccounts((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(destination.publicKey);
                  return newSet;
                });
              }
            } else {
              /** Skip */
              setResultValue(destination.publicKey, {
                status: true,
                skipped: true,
              });
            }
          })
        );
      }

      try {
        /** Refetch */
        await refetch?.();
      } catch (e) {
        console.warn("Failed to Refetch");
        console.error(e);
      }

      /** Stop Processing */
      setIsProcessing(false);
    },
    [accounts, setResultValue, selectedAccounts]
  );

  /** Acquire WakeLock */
  useWakeLock(isProcessing);

  /** Prevent Automatic Logout */
  usePendingActivity(isProcessing);

  return useMemo(
    () => ({
      accountsMapped,
      activeAccounts,
      selectedAccounts,
      results,
      isProcessing,
      execute,
      setResultValue,
      toggleAccount,
      toggleAllAccounts,
    }),
    [
      accountsMapped,
      activeAccounts,
      selectedAccounts,
      results,
      isProcessing,
      execute,
      setResultValue,
      toggleAccount,
      toggleAllAccounts,
    ]
  );
}
