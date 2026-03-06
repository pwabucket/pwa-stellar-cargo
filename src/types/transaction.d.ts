import type { Account } from "./account";

/** Transaction result */
export interface TransactionResult {
  transaction: string;
  network_passphrase: string;
}

/** Batch transaction result for a single account */
export interface BatchTransactionResult {
  status: boolean;
  skipped?: boolean;
  response?: unknown;
  error?: unknown;
}

/** Batch transactions hook return type */
export interface BatchTransactions {
  accountsMapped: [string, Account][];
  activeAccounts: Set<string>;
  selectedAccounts: Map<string, Account>;
  results: Map<string, BatchTransactionResult>;
  isProcessing: boolean;
  execute: (
    callback: (item: Account | Account[]) => Promise<unknown>,
    options: {
      size?: number;
      single?: boolean;
      refetch?: () => Promise<unknown>;
    },
  ) => Promise<void>;
  baseExecute: (
    callback: () => Promise<void>,
    options: { refetch?: () => Promise<unknown> },
  ) => Promise<void>;
  skipAccount: (publicKey: string) => void;
  setResultValue: (publicKey: string, data: BatchTransactionResult) => void;
  toggleAccount: (account: Account, checked: boolean) => void;
  toggleAllAccounts: (checked: boolean) => void;
  toggleProcessingState: (publicKey: string, state?: boolean) => void;
}
