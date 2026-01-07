import Decimal from "decimal.js";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetsMeta from "@/hooks/useAssetsMeta";
import usePendingClaimable from "@/hooks/usePendingClaimable";
import { calculateXLMReserve } from "@/lib/utils";
import { useMemo } from "react";

export default function useAccountDetails(publicKey) {
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
      accountQuery.data
        ? accountQuery.data.balances.find(
            (balance) => balance["asset_type"] === "native"
          )
        : { balance: "0" },
    [accountQuery.data]
  );

  /* Account Reserve Balance */
  const accountReserveBalance = useMemo(
    () =>
      accountQuery.data
        ? calculateXLMReserve(accountQuery.data)
        : new Decimal(0),
    [accountQuery.data]
  );

  /* Account Below Reserve */
  const accountIsBelowReserve = new Decimal(accountXLM["balance"]).lessThan(
    accountReserveBalance
  );

  /* Asset Ids */
  const assetIds = useMemo(
    () =>
      accountQuery.data
        ? accountQuery.data.balances.map((balance) =>
            balance["asset_type"] === "native"
              ? "XLM"
              : `${balance["asset_code"]}-${balance["asset_issuer"]}`
          )
        : [],
    [accountQuery.data]
  );

  /* Assets Meta */
  const assetsMeta = useAssetsMeta(assetIds);

  /* Balances with Meta */
  const balances = useMemo(
    () =>
      accountQuery.data?.balances?.map((item) => {
        const assetId =
          item["asset_type"] === "native"
            ? "XLM"
            : `${item["asset_code"]}-${item["asset_issuer"]}`;

        return {
          ...item,
          ["asset_id"]: assetId,
          ["asset_name"]:
            item["asset_type"] === "native" ? "XLM" : item["asset_code"],
          ["asset_icon"]: assetsMeta?.[assetId]?.["icon"],
          ["asset_meta"]: assetsMeta?.[assetId],
          ["asset_domain"]: assetsMeta?.[assetId]?.["domain"],
          ["transaction_name"]:
            item["asset_type"] === "native"
              ? item["asset_type"]
              : `${item?.["asset_code"]}:${item?.["asset_issuer"]}`,
        };
      }) || [],
    [accountQuery.data, assetsMeta]
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
