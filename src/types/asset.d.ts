import type Decimal from "decimal.js";
import type { HorizonBalance } from "./stellar";
import type { AssetType } from "@stellar/stellar-sdk";

export interface AssetMeta {
  asset: string;
  domain?: string;
  unconfirmed_domain?: string;
  toml_info?: {
    image?: string;
    [key: string]: unknown;
  };
  icon?: string;
  [key: string]: unknown;
}

/** Keyed lookup for asset metadata by asset id */
export type AssetsMetaMap = Record<string, AssetMeta>;

/** ======== Enriched Balances ======== */

/** Balance enriched with computed fields */
export interface EnrichedBalance extends HorizonBalance {
  asset_id: string;
  asset_type: AssetType;
  asset_code?: string;
  asset_issuer?: string;
  asset_name?: string;
  asset_icon?: string;
  asset_meta?: AssetMeta;
  asset_domain?: string;
  transaction_name?: string;
  sponsor?: string;
  balance: Decimal.Value;
}
