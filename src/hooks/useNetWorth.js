import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

import useAssetsMeta from "./useAssetsMeta";
import useTotalAccountsQuery from "./useTotalAccountsQuery";
import useTotalAssetsPriceQuery from "./useTotalAssetsPriceQuery";

/**
 * @type {import("@tanstack/react-query").UseQueryOptions}
 */
const queryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 30_000,
};

export default function useNetWorth() {
  const accounts = useAppStore((state) => state.accounts);
  const list = useMemo(
    () => accounts.map((account) => account.publicKey),
    [accounts]
  );

  const totalAccountsQuery = useTotalAccountsQuery(list, queryOptions);
  const totalAssets = useMemo(
    () =>
      totalAccountsQuery.isSuccess
        ? totalAccountsQuery.data?.reduce(
            (result, current) => result.concat(current?.balances),
            []
          )
        : [],
    [totalAccountsQuery.isSuccess, totalAccountsQuery.data]
  );

  const totalAssetsBalance = useMemo(
    () =>
      Array.from(
        totalAssets
          .reduce((result, item) => {
            const assetId =
              item["asset_type"] === "native"
                ? "XLM"
                : `${item["asset_code"]}-${item["asset_issuer"]}`;

            return result.set(assetId, {
              ["asset_id"]: assetId,
              ["asset_type"]: item["asset_type"],
              ["asset_code"]: item["asset_code"],
              ["asset_issuer"]: item["asset_issuer"],
              ["balance"]: (
                parseFloat(item["balance"]) +
                parseFloat(result.get(assetId)?.["balance"] || 0)
              ).toFixed(7),
            });
          }, new Map())
          .values()
      ),
    [totalAssets]
  );

  const assetIds = useMemo(
    () => totalAssetsBalance.map((item) => item["asset_id"]),
    [totalAssetsBalance]
  );

  const assetsMeta = useAssetsMeta(assetIds);

  const totalAssetsPriceQuery = useTotalAssetsPriceQuery(totalAssetsBalance, {
    ...queryOptions,
    enabled: totalAssetsBalance.length > 0,
  });

  const totalAssetsPrice = totalAssetsPriceQuery.data;

  const totalNetWorth = useMemo(
    () =>
      totalAssetsPrice.reduce(
        (result, price) => result + parseFloat(price || 0),
        0
      ),
    [totalAssetsPrice]
  );

  const isSuccess =
    totalAccountsQuery.isSuccess && totalAssetsPriceQuery.isSuccess;

  const assets = useMemo(
    () =>
      totalAssetsBalance.map((item, index) => {
        const assetId = item["asset_id"];

        return {
          ...item,
          ["asset_id"]: assetId,
          ["asset_name"]:
            item["asset_type"] === "native" ? "XLM" : item["asset_code"],
          ["asset_icon"]: assetsMeta?.[assetId]?.["icon"],
          ["asset_meta"]: assetsMeta?.[assetId],
          ["asset_domain"]: assetsMeta?.[assetId]?.["domain"],
          ["usd_value"]: totalAssetsPrice[index],
        };
      }) || [],
    [totalAssetsBalance, totalAssetsPrice, assetsMeta]
  );

  return useMemo(
    () => ({
      isSuccess,
      assets,
      totalNetWorth,
    }),
    [isSuccess, assets, totalNetWorth]
  );
}
