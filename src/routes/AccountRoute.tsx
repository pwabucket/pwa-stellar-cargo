import { Outlet, useParams } from "react-router";
import { cn, copyToClipboard, truncatePublicKey } from "@/lib/utils";

import AccountImage from "@/components/AccountImage";
import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import { IoCopyOutline } from "react-icons/io5";
import useAccountDetails from "@/hooks/useAccountDetails";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { useOutletContext } from "react-router";

export default function AccountRoute() {
  const { publicKey } = useParams<{ publicKey: string }>();
  const context = useOutletContext<Record<string, unknown>>();
  const {
    account,
    accountQuery,
    pendingClaimable,
    accountXLM,
    accountReserveBalance,
    accountIsBelowReserve,
    balances,
    assetIds,
    assetsMeta,
  } = useAccountDetails(publicKey);

  /** Redirect */
  useCheckOrNavigate(account, "/", {
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
                "text-xs text-center text-blue-400",
                "flex items-center justify-center gap-1",
                "cursor-pointer",
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
      {account ? (
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
      ) : (
        <FullPageSpinner />
      )}
    </InnerAppLayout>
  );
}
