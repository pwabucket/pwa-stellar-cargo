import type Decimal from "decimal.js";
import type { EnrichedBalance } from "./asset";
import type { HorizonClaimableBalance } from "./stellar";

/** Asset with USD price info */
export interface NetWorthAsset extends EnrichedBalance {
  usd_value?: string | null;
  claimables?: HorizonClaimableBalance[];
}

/** Result from useBaseNetWorth */
export interface BaseNetWorth {
  isSuccess: boolean;
  assets: NetWorthAsset[];
  totalNetWorth: Decimal;
}
