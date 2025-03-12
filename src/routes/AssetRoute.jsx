import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Outlet, useParams } from "react-router";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function AssetRoute() {
  const params = useParams();
  const context = useOutletContext();
  const { assetMeta, balances } = context;

  const asset = useMemo(
    () =>
      balances.find((item) =>
        params.asset === "XLM"
          ? item["asset_type"] === "native"
          : item["asset_code"] === params.asset.split("-")[0] &&
            item["asset_issuer"] === params.asset.split("-")[1]
      ),
    [params.asset, balances]
  );

  const assetName = asset?.["asset_name"];
  const assetTransactionName = asset?.["transaction_name"];

  const assetPriceQuery = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"],
    asset?.["asset_issuer"],
    asset?.["balance"]
  );

  const assetValue = assetPriceQuery.data;

  /** Redirect */
  useCheckOrNavigate(asset, -1, {
    replace: true,
  });

  return (
    <Outlet
      context={{
        ...context,
        asset,
        assetPriceQuery,
        assetValue,
        assetName,
        assetTransactionName,
      }}
    />
  );
}
