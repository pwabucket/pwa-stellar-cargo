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

  const meta = useMemo(
    () => assetMeta[params.asset],
    [params.asset, assetMeta]
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
      }}
    />
  );
}
