import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import QueryError from "@/components/QueryError";
import Spinner from "@/components/Spinner";
import cn from "@/lib/utils";
import copy from "copy-to-clipboard";
import useAccount from "@/hooks/useAccount";
import useAccountQuery from "@/hooks/useAccountQuery";
import useAssetMetaQuery from "@/hooks/useAssetMetaQuery";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { HiOutlinePencil } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link, useParams } from "react-router";
import { useMemo } from "react";
export default function Account() {
  const { publicKey } = useParams();
  const account = useAccount(publicKey);
  const accountQuery = useAccountQuery(publicKey, {
    enabled: typeof account !== "undefined",
  });

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

  const assetIcon = useMemo(
    () =>
      assetMetaQuery.data
        ? Object.fromEntries(
            assetMetaQuery.data.map((item) => [
              item["toml_info"]["issuer"] || item["asset"],
              item["toml_info"]["image"],
            ])
          )
        : {},
    [assetMetaQuery.data]
  );

  /** Redirect */
  useCheckOrNavigate(account, "/app", {
    replace: true,
  });

  return account ? (
    <InnerAppLayout>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-4 bg-blue-500 text-white rounded-xl">
          {/* Account Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-light truncate grow min-w-0">
              {account.name || "Stellar Account"}
            </h2>

            {/* Edit Button */}
            <Link
              to={`edit`}
              className={cn(
                "shrink-0 bg-blue-400 size-9",
                "flex items-center justify-center",
                "rounded-full"
              )}
            >
              <HiOutlinePencil className="size-4" />
            </Link>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy(account.publicKey)}
              className="shrink-0"
            >
              <IoCopyOutline className="size-4" />
            </button>
            <h3 className="text-blue-100 truncate grow min-w-0 font-medium">
              {account.publicKey}
            </h3>
          </div>
        </div>

        {accountQuery.isPending ? (
          <Spinner />
        ) : accountQuery.isError ? (
          <QueryError />
        ) : (
          <div className="flex flex-col gap-1">
            {accountQuery.data.balances.map((balance, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded-xl",
                  "bg-neutral-100",
                  "flex items-center gap-2"
                )}
              >
                {/* Icon */}
                <img
                  src={
                    assetIcon[
                      balance["asset_type"] === "native"
                        ? "XLM"
                        : balance["asset_issuer"]
                    ]
                  }
                  className={cn(
                    "shrink-0 size-8 rounded-full",
                    "bg-neutral-200"
                  )}
                />

                {/* Asset Type */}
                <h4 className="grow min-w-0 truncate">
                  {balance["asset_type"] === "native"
                    ? "XLM"
                    : balance["asset_code"]}
                </h4>

                {/* Balance */}
                <p className="shrink-0 text-blue-500">
                  {Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 20,
                  }).format(balance["balance"])}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </InnerAppLayout>
  ) : (
    <FullPageSpinner />
  );
}
