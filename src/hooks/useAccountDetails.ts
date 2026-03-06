import type { EnrichedBalance, HorizonBalanceAsset } from "@/types";

import Decimal from "decimal.js";
import { calculateXLMReserve } from "@/lib/utils";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetsMeta from "@/hooks/useAssetsMeta";
import { useMemo } from "react";
import usePendingClaimable from "@/hooks/usePendingClaimable";

export default function useAccountDetails(publicKey?: string) {
  const account = useAccount(publicKey);
  const accountQuery = useAccountQuery(publicKey, {
    enabled: typeof account !== "undefined",
  });

  /* Pending Claimable */
  const pendingClaimable = usePendingClaimable(publicKey, {
    enabled: typeof account !== "undefined",
  });

  /* Account XLM */
  const accountXLM = useMemo(
    () =>
      accountQuery.data?.balances.find(
        (balance) => balance["asset_type"] === "native",
      ),
    [accountQuery.data],
  );

  /* Account Reserve Balance */
  const accountReserveBalance = useMemo(
    () =>
      accountQuery.data
        ? calculateXLMReserve(accountQuery.data)
        : new Decimal(0),
    [accountQuery.data],
  );

  /* Account Below Reserve */
  const accountIsBelowReserve = new Decimal(
    accountXLM ? accountXLM["balance"] : "0",
  ).lessThan(accountReserveBalance);

  /* Asset Ids */
  const assetIds = useMemo(
    () =>
      accountQuery.data
        ? accountQuery.data.balances.map((balance) => {
            const assetBalance = balance as HorizonBalanceAsset;
            return balance["asset_type"] === "native"
              ? "XLM"
              : `${assetBalance["asset_code"]}-${assetBalance["asset_issuer"]}`;
          })
        : [],
    [accountQuery.data],
  );

  /* Assets Meta */
  const assetsMeta = useAssetsMeta(assetIds);

  /* Balances with Meta */
  const balances: EnrichedBalance[] = useMemo(
    () =>
      accountQuery.data?.balances?.map((item) => {
        const assetItem = item as HorizonBalanceAsset;
        const assetId =
          item["asset_type"] === "native"
            ? "XLM"
            : `${assetItem["asset_code"]}-${assetItem["asset_issuer"]}`;

        return {
          ...item,
          ["asset_id"]: assetId,
          ["asset_name"]:
            item["asset_type"] === "native" ? "XLM" : assetItem["asset_code"],
          ["asset_icon"]: assetsMeta?.[assetId]?.["icon"],
          ["asset_meta"]: assetsMeta?.[assetId],
          ["asset_domain"]: assetsMeta?.[assetId]?.["domain"],
          ["transaction_name"]:
            item["asset_type"] === "native"
              ? item["asset_type"]
              : `${assetItem["asset_code"]}:${assetItem["asset_issuer"]}`,
        };
      }) || [],
    [accountQuery.data, assetsMeta],
  );

  return {
    account,
    accountQuery,
    pendingClaimable,
    accountXLM,
    accountReserveBalance,
    accountIsBelowReserve,
    assetIds,
    assetsMeta,
    balances,
  };
}
