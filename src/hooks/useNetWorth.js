import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

import useTotalAccountsQuery from "./useTotalAccountsQuery";
import useTotalAssetsPriceQuery from "./useTotalAssetsPriceQuery";

/**
 * @type {import("@tanstack/react-query").UseQueryOptions}
 */
const queryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 20_000,
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

  const filteredAssets = useMemo(
    () =>
      totalAssets.filter(
        (asset, index, list) =>
          index ===
          list.findIndex(
            (item) =>
              item["asset_code"] === asset["asset_code"] &&
              item["asset_issuer"] === asset["asset_issuer"] &&
              item["balance"] === asset["balance"]
          )
      ),
    [totalAssets]
  );

  const totalAssetsPriceQuery = useTotalAssetsPriceQuery(filteredAssets, {
    ...queryOptions,
    enabled: filteredAssets.length > 0,
  });

  const totalAssetsPrice = totalAssetsPriceQuery.data;

  const totalNetWorth = useMemo(
    () =>
      totalAssets.reduce(
        (result, asset) =>
          result +
          parseFloat(
            totalAssetsPrice[
              filteredAssets.findIndex(
                (item) =>
                  item["asset_code"] === asset["asset_code"] &&
                  item["asset_issuer"] === asset["asset_issuer"] &&
                  item["balance"] === asset["balance"]
              )
            ] || 0
          ),
        0
      ),
    [totalAssets, filteredAssets, totalAssetsPrice]
  );

  const isSuccess =
    totalAccountsQuery.isSuccess && totalAssetsPriceQuery.isSuccess;

  return useMemo(
    () => ({
      isSuccess,
      totalNetWorth,
    }),
    [isSuccess, totalNetWorth]
  );
}
