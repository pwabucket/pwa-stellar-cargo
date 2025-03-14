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

  /** Skip */
  const skipAccount = useCallback(
    (publicKey) => {
      setResultValue(publicKey, {
        status: true,
        skipped: true,
      });
    },
    [setResultValue]
  );

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

  const toggleProcessingState = useCallback((publicKey, state = true) => {
    if (state) {
      setActiveAccounts((prev) => new Set(prev).add(publicKey));
    } else {
      /** Remove from Processing */
      setActiveAccounts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(publicKey);
        return newSet;
      });
    }
  }, []);

  /** Execute */
  const baseExecute = useCallback(async (callback, { refetch }) => {
    /** Reset */
    setResults(new Map());
    setActiveAccounts(new Set());
    setIsProcessing(true);

    /** Run Callback */
    await callback?.();

    try {
      /** Refetch */
      await refetch?.();
    } catch (e) {
      console.warn("Failed to Refetch");
      console.error(e);
    }

    /** Stop Processing */
    setIsProcessing(false);
  }, []);

  /** Execute */
  const execute = useCallback(
    async (callback, { size = 5, single = false, refetch }) => {
      await baseExecute(
        async function () {
          /** Skip all unselected accounts */
          accounts
            .filter((item) => selectedAccounts.has(item.publicKey) === false)
            .forEach((item) => {
              skipAccount(item.publicKey);
            });

          for (const chunk of chunkArrayGenerator(
            Array.from(selectedAccounts.values()),
            size
          )) {
            if (single) {
              try {
                /** Mark group as Active */
                chunk.forEach((item) => {
                  toggleProcessingState(item.publicKey, true);
                });

                /** Callback */
                const response = await callback(chunk);

                /** Log Response */
                console.log(response);

                /** Set Response */
                chunk.forEach((item) => {
                  setResultValue(item.publicKey, {
                    status: true,
                    skipped: typeof response === "undefined",
                    response,
                  });
                });
              } catch (error) {
                /** Log Error */
                console.error(error);

                /** Set Error */
                chunk.forEach((item) => {
                  setResultValue(item.publicKey, {
                    status: false,
                    error,
                  });
                });
              } finally {
                /** Mark group as Inactive */
                chunk.forEach((item) => {
                  toggleProcessingState(item.publicKey, false);
                });
              }
            } else {
              await Promise.allSettled(
                chunk.map(async (item) => {
                  try {
                    /** Mark as Active */
                    toggleProcessingState(item.publicKey, true);

                    /** Callback */
                    const response = await callback(item);

                    /** Log Response */
                    console.log(response);

                    /** Set Response */
                    setResultValue(item.publicKey, {
                      status: true,
                      skipped: typeof response === "undefined",
                      response,
                    });
                  } catch (error) {
                    /** Log Error */
                    console.error(error);

                    /** Set Error */
                    setResultValue(item.publicKey, {
                      status: false,
                      error,
                    });
                  } finally {
                    /** Mark as Active */
                    toggleProcessingState(item.publicKey, false);
                  }
                })
              );
            }
          }
        },
        /** Options */
        { refetch }
      );
    },
    [
      accounts,
      selectedAccounts,
      baseExecute,
      skipAccount,
      setResultValue,
      toggleProcessingState,
    ]
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
      baseExecute,
      skipAccount,
      setResultValue,
      toggleAccount,
      toggleAllAccounts,
      toggleProcessingState,
    }),
    [
      accountsMapped,
      activeAccounts,
      selectedAccounts,
      results,
      isProcessing,
      execute,
      baseExecute,
      skipAccount,
      setResultValue,
      toggleAccount,
      toggleAllAccounts,
      toggleProcessingState,
    ]
  );
}
