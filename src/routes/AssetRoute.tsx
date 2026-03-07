import { Outlet, useParams } from "react-router";

import type { AccountRouteContext } from "@/types/index.d.ts";
import Spinner from "@/components/Spinner";
import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function AssetRoute() {
  const params = useParams<{ asset: string }>();
  const context = useOutletContext<AccountRouteContext>();
  const { balances } = context;

  const asset = useMemo(
    () => balances.find((item) => params.asset === item["asset_id"]),
    [params.asset, balances],
  );

  const assetName = asset?.["asset_name"];
  const assetTransactionName = asset?.["transaction_name"];

  const assetPriceQuery = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"] || "",
    asset?.["asset_issuer"] || "",
    asset?.["balance"] || "0",
  );

  const assetValue = assetPriceQuery.data;

  /** Redirect */
  useCheckOrNavigate(asset, -1, {
    replace: true,
  });

  return asset ? (
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
  ) : (
    <Spinner />
  );
}
