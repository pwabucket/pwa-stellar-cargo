import type Decimal from "decimal.js";
import type { EnrichedBalance } from "./asset";
import type { HorizonClaimableBalance } from "./stellar";

/** Aggregated claimable asset (from multiple claimable balance records) */
export interface ClaimableAsset extends EnrichedBalance {
  amount?: Decimal.Value;
  claimables: HorizonClaimableBalance[];
}

/** A single claimable stake derived from a claimable balance */
export interface ClaimableStake {
  id: string;
  amount: Decimal.Value;
  sponsor?: string;
  createdAt: string;
  releaseDate: string | null;
  expiryDate: string | null;
}

/** Predicate-extracted dates */
export interface PredicateDates {
  releaseDate: string | null;
  expiryDate: string | null;
}
