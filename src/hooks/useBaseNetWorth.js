import Decimal from "decimal.js";
import { useMemo } from "react";

import useAssetsMeta from "./useAssetsMeta";
import useTotalAssetsPriceQuery from "./useTotalAssetsPriceQuery";

/**
 * @type {import("@tanstack/react-query").UseQueryOptions}
 */
const queryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 30_000,
};

export default function useBaseNetWorth(totalAssets) {
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
              ["balance"]: new Decimal(item["balance"])
                .plus(new Decimal(result.get(assetId)?.["balance"] || 0))
                .toFixed(7, Decimal.ROUND_DOWN),
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
        (result, price) => result.plus(new Decimal(price || 0)),
        new Decimal(0)
      ),
    [totalAssetsPrice]
  );

  const isSuccess = totalAssetsPriceQuery.isSuccess;

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
