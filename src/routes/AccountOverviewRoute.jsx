import AccountImage from "@/components/AccountImage";
import copy from "copy-to-clipboard";
import useTotalAssetsPriceQuery from "@/hooks/useTotalAssetsPriceQuery";
import {
  HiOutlineArrowPath,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlineQrCode,
} from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useMatch } from "react-router";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

const PageNavLink = ({ styleActive = true, ...props }) => (
  <NavLink
    {...props}
    end
    className={({ isActive }) =>
      cn(
        "text-center",
        isActive &&
          styleActive && [
            "font-bold text-blue-500",
            "bg-neutral-100 dark:bg-neutral-800",
            "rounded-full py-1",
          ]
      )
    }
  />
);

const ToolLink = ({ icon: Icon, title, ...props }) => (
  <Link
    {...props}
    className={cn(
      "flex flex-col justify-center items-center gap-1",
      props.className
    )}
  >
    <span
      className={cn(
        "bg-neutral-100 dark:bg-neutral-800",
        "flex justify-center items-center",
        "rounded-full size-12"
      )}
    >
      <Icon className="size-6" />
    </span>
    <h5 className="text-xs">{title}</h5>
  </Link>
);

export default function AccountOverviewRoute() {
  const context = useOutletContext();
  const { account, balances } = context;

  /** Total Assets */
  const totalAssetsPriceQuery = useTotalAssetsPriceQuery(balances, {
    enabled: balances?.length > 0,
  });

  const totalAssetsPrice = useMemo(
    () =>
      totalAssetsPriceQuery.data?.reduce(
        (result, current) => result + parseFloat(current || 0),
        0
      ),
    [totalAssetsPriceQuery.data]
  );

  const assetsPage = `/accounts/${account.publicKey}`;
  const match = useMatch(assetsPage);
  const isAssetsPage = match && match.pattern.end;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 p-4 bg-blue-600 text-white rounded-2xl">
          {/* Account Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-light truncate grow min-w-0 flex gap-2 items-center">
              <AccountImage
                publicKey={account.publicKey}
                className="size-10 shrink-0 rounded-full bg-white"
              />{" "}
              {account.name || "Stellar Account"}
            </h2>

            {/* Edit Button */}
            <Link
              to={`edit`}
              className={cn(
                "shrink-0 bg-blue-500 size-9",
                "flex items-center justify-center",
                "rounded-full"
              )}
            >
              <HiOutlinePencilSquare className="size-5" />
            </Link>
          </div>

          {totalAssetsPriceQuery.isSuccess ? (
            <p className="text-3xl">
              ~${Intl.NumberFormat().format(totalAssetsPrice)}
            </p>
          ) : (
            <div className="bg-blue-500 rounded-full h-4 w-1/2 animate-pulse" />
          )}

          {/* Address */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy(account.publicKey)}
              className="shrink-0"
            >
              <IoCopyOutline className="size-4" />
            </button>
            <h3 className="text-blue-100 truncate grow min-w-0 text-sm">
              <a
                target="_blank"
                href={`https://stellar.expert/explorer/public/account/${account.publicKey}`}
              >
                {truncatePublicKey(account.publicKey, 8)}
              </a>
            </h3>
          </div>
        </div>

        <div className="mt-2 flex gap-4 justify-center">
          <ToolLink
            title={"Send"}
            icon={HiOutlinePaperAirplane}
            to={`/accounts/${account.publicKey}/send`}
          />

          <ToolLink
            title={"Receive"}
            icon={HiOutlineQrCode}
            to={`/accounts/${account.publicKey}/receive`}
          />

          <ToolLink
            title={"Swap"}
            icon={HiOutlineArrowPath}
            to={`/accounts/${account.publicKey}/swap`}
          />
        </div>

        {/* NavLinks */}
        <div className="grid grid-cols-2 p-2">
          <PageNavLink
            replace
            styleActive={isAssetsPage}
            to={isAssetsPage ? assetsPage : -1}
          >
            Assets
          </PageNavLink>
          <PageNavLink to={`/accounts/${account.publicKey}/transactions`}>
            Transactions
          </PageNavLink>
        </div>

        <Outlet context={context} />
      </div>
    </>
  );
}
