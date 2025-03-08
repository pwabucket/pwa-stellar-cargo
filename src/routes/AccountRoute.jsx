import InnerAppLayout from "@/layouts/InnerAppLayout";
import Spinner from "@/components/Spinner";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetMetaQuery from "@/hooks/useAssetMetaQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Outlet, useParams } from "react-router";
import { truncatePublicKey } from "@/lib/utils";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

const BASE_RESERVE = 0.5;

export default function AccountRoute() {
  const { publicKey } = useParams();
  const context = useOutletContext();
  const account = useAccount(publicKey);
  const accountQuery = useAccountQuery(publicKey, {
    enabled: typeof account !== "undefined",
  });

  const accountReserveBalance = useMemo(
    () =>
      accountQuery.data
        ? BASE_RESERVE * (2 + accountQuery.data["subentry_count"])
        : 0,
    [accountQuery.data]
  );

  const accountXLM = useMemo(
    () =>
      accountQuery.data
        ? accountQuery.data.balances.find(
            (balance) => balance["asset_type"] === "native"
          )
        : [],
    [accountQuery.data]
  );

  const accountIsBelowReserve = accountXLM["balance"] < accountReserveBalance;

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

  const assetMetaQuery = useAssetMetaQuery(assetIds, {
    enabled: assetIds.length >= 1,
  });

  const assetMeta = useMemo(
    () =>
      assetMetaQuery.data
        ? Object.fromEntries(
            assetMetaQuery.data.map((item) => [
              item["toml_info"]["issuer"] || item["asset"],
              item,
            ])
          )
        : {},
    [assetMetaQuery.data]
  );

  const assetIcon = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(assetMeta).map(([k, v]) => [k, v["toml_info"]["image"]])
      ),
    [assetMeta]
  );

  /** Redirect */
  useCheckOrNavigate(account, "/app", {
    replace: true,
  });

  return (
    <InnerAppLayout
      headerMiddleContent={
        account ? (
          <>
            <h3 className="text-center font-bold">
              {account.name || "Stellar Account"}
            </h3>
            <h4 className="text-xs text-center text-blue-500">
              {truncatePublicKey(account.publicKey)}
            </h4>
          </>
        ) : null
      }
    >
      {assetMetaQuery.isSuccess ? (
        <Outlet
          context={{
            ...context,
            account,
            accountReserveBalance,
            accountIsBelowReserve,
            accountQuery,
            assetMetaQuery,
            assetIds,
            assetMeta,
            assetIcon,
            publicKey,
          }}
        />
      ) : (
        <Spinner />
      )}
    </InnerAppLayout>
  );
}
