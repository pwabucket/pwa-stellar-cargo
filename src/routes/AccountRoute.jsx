import AccountImage from "@/components/AccountImage";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetsMeta from "@/hooks/useAssetsMeta";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { IoCopyOutline } from "react-icons/io5";
import { Outlet, useParams } from "react-router";
import {
  calculateXLMReserve,
  cn,
  copyToClipboard,
  truncatePublicKey,
} from "@/lib/utils";
import { useMemo } from "react";
import { useOutletContext } from "react-router";
import usePendingClaimable from "@/hooks/usePendingClaimable";
import Decimal from "decimal.js";

export default function AccountRoute() {
  const { publicKey } = useParams();
  const context = useOutletContext();
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
        : [],
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

  /** Redirect */
  useCheckOrNavigate(account, "/app", {
    replace: true,
  });

  return (
    <InnerAppLayout
      headerMiddleContent={
        account ? (
          <>
            <h3 className="text-center font-bold flex gap-2 items-center justify-center">
              <AccountImage
                publicKey={account.publicKey}
                className="size-4 shrink-0"
              />{" "}
              {account.name || "Stellar Account"}
            </h3>
            <h4
              className={cn(
                "text-xs text-center text-blue-500",
                "flex items-center justify-center gap-1",
                "cursor-pointer"
              )}
              onClick={() => copyToClipboard(account.publicKey)}
            >
              <IoCopyOutline className="size-3" />
              {truncatePublicKey(account.publicKey)}
            </h4>
          </>
        ) : null
      }
    >
      <Outlet
        context={{
          ...context,
          account,
          accountReserveBalance,
          accountIsBelowReserve,
          accountXLM,
          accountQuery,
          pendingClaimable,
          assetIds,
          assetsMeta,
          balances,
          publicKey,
        }}
      />
    </InnerAppLayout>
  );
}
