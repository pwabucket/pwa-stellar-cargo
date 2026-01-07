import AccountImage from "@/components/AccountImage";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAccountDetails from "@/hooks/useAccountDetails";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { IoCopyOutline } from "react-icons/io5";
import { Outlet, useParams } from "react-router";
import { cn, copyToClipboard, truncatePublicKey } from "@/lib/utils";
import { useOutletContext } from "react-router";

export default function AccountRoute() {
  const { publicKey } = useParams();
  const context = useOutletContext();
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
