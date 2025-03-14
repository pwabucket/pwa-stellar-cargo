import AccountAssetPlaceholder from "@/components/AccountAssetPlaceholder";
import AccountImage from "@/components/AccountImage";
import AccountPlaceholder from "@/components/AccountPlaceholder";
import DefaultAssetIcon from "@/assets/images/asset.png?format=webp&w=80";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetMetaQuery from "@/hooks/useAssetMetaQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { IoCopyOutline } from "react-icons/io5";
import { Outlet, useParams } from "react-router";
import {
  calculateXLMReserve,
  cn,
  copyToClipboard,
  repeatComponent,
  truncatePublicKey,
} from "@/lib/utils";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function AccountRoute() {
  const { publicKey } = useParams();
  const context = useOutletContext();
  const account = useAccount(publicKey);
  const accountQuery = useAccountQuery(publicKey, {
    enabled: typeof account !== "undefined",
  });

  const accountXLM = useMemo(
    () =>
      accountQuery.data
        ? accountQuery.data.balances.find(
            (balance) => balance["asset_type"] === "native"
          )
        : [],
    [accountQuery.data]
  );

  const accountReserveBalance = useMemo(
    () => (accountQuery.data ? calculateXLMReserve(accountQuery.data) : 0),
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
    enabled: assetIds.length > 0,
  });

  const assetMeta = useMemo(
    () =>
      assetMetaQuery.data
        ? Object.fromEntries(
            assetMetaQuery.data.map((item) => [
              item["asset"].split("-").slice(0, 2).join("-"),
              item,
            ])
          )
        : {},
    [assetMetaQuery.data]
  );

  const assetIcon = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(assetMeta).map(([k, v]) => [
          k,
          v["toml_info"]?.["image"],
        ])
      ),
    [assetMeta]
  );

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
          ["asset_icon"]: assetIcon?.[assetId] || DefaultAssetIcon,
          ["asset_meta"]: assetMeta?.[assetId],
          ["asset_domain"]: assetMeta?.[assetId]?.["domain"],
          ["transaction_name"]:
            item["asset_type"] === "native"
              ? item["asset_type"]
              : `${item?.["asset_code"]}:${item?.["asset_issuer"]}`,
        };
      }) || [],
    [accountQuery.data, assetMeta, assetIcon]
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
      {accountQuery.isSuccess ? (
        <Outlet
          context={{
            ...context,
            account,
            accountReserveBalance,
            accountIsBelowReserve,
            accountXLM,
            accountQuery,
            assetMetaQuery,
            assetIds,
            assetMeta,
            assetIcon,
            balances,
            publicKey,
          }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {/* Account */}
          <AccountPlaceholder />

          {/* Send & Receive */}
          <div className="flex gap-4 justify-center">
            {repeatComponent(
              <div
                className={cn(
                  "flex flex-col justify-center items-center gap-1"
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "bg-neutral-100 dark:bg-neutral-800",
                    "flex justify-center items-center",
                    "rounded-full size-12"
                  )}
                />
                {/* Title */}
                <div className="rounded-full w-full h-3 bg-neutral-100 dark:bg-neutral-800" />
              </div>,
              4
            )}
          </div>

          {/* NavLinks */}
          <div className="p-2">
            {/* Asset */}
            <div className="rounded-full w-1/2 h-6 bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Assets */}
          {repeatComponent(<AccountAssetPlaceholder />, 4)}
        </div>
      )}
    </InnerAppLayout>
  );
}
