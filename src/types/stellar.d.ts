import type { Horizon } from "@stellar/stellar-sdk";

/** Full Horizon account record */
export type HorizonAccount = Horizon.ServerApi.AccountRecord;

/** A balance entry from Horizon (native or credit) */
export type HorizonBalance = Horizon.HorizonApi.BalanceLine;

/** Horizon balance line asset */
export type HorizonBalanceAsset = Horizon.HorizonApi.BalanceLineAsset;
export type HorizonBalanceNative = Horizon.HorizonApi.BalanceLineNative;

/** Horizon claimable balance record */
export type HorizonClaimableBalance =
  Horizon.ServerApi.ClaimableBalanceRecord & {
    last_modified_time: string;
  };
