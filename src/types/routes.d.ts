import type Decimal from "decimal.js";
import type { Account } from "./account";
import type { AssetsMetaMap, EnrichedBalance } from "./asset";
import type { ClaimableAsset } from "./claimable";
import type { HorizonAccount, HorizonBalance } from "./stellar";
import type { UseQueryResult } from "@tanstack/react-query";

/** Account route context */
export interface AccountRouteContext {
  account: Account;
  accountQuery: UseQueryResult<HorizonAccount | null>;
  pendingClaimable: ClaimableAsset[];
  accountXLM?: HorizonBalance;
  accountReserveBalance: Decimal;
  accountIsBelowReserve: boolean;
  assetIds: string[];
  assetsMeta: AssetsMetaMap;
  balances: EnrichedBalance[];
  publicKey: string;
}

/** Asset route extends Account route */
export interface AssetRouteContext extends AccountRouteContext {
  asset: EnrichedBalance;
  assetPriceQuery: UseQueryResult<string | null>;
  assetValue: string | null;
  assetName: string;
  assetTransactionName: string;
}

/** Claimable route extends Account route */
export interface ClaimableRouteContext extends AccountRouteContext {
  claimableAsset: ClaimableAsset;
}
