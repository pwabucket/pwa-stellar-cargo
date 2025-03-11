import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Outlet, useParams } from "react-router";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function AssetRoute() {
  const params = useParams();
  const context = useOutletContext();
  const { assetMeta, accountQuery } = context;

  const asset = useMemo(
    () =>
      accountQuery.data.balances.find((item) =>
        params.asset === "XLM"
          ? item["asset_type"] === "native"
          : item["asset_issuer"] === params.asset
      ),
    [params.asset, accountQuery.data]
  );

  const assetName =
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"];

  const assetTransactionName =
    asset?.["asset_type"] === "native"
      ? "native"
      : `${asset?.["asset_code"]}:${asset?.["asset_issuer"]}`;

  const meta = useMemo(
    () => assetMeta[params.asset],
    [params.asset, assetMeta]
  );

  const assetPriceQuery = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"],
    asset?.["asset_issuer"]
  );

  const assetPrice = assetPriceQuery.data;
  const assetValue = useMemo(
    () => (assetPrice ? assetPrice * asset["balance"] : null),
    [asset, assetPrice]
  );

  /** Redirect */
  useCheckOrNavigate(asset, -1, {
    replace: true,
  });

  return (
    <Outlet
      context={{
        ...context,
        asset,
        meta,
        assetPriceQuery,
        assetPrice,
        assetValue,
        assetName,
        assetTransactionName,
      }}
    />
  );
}
