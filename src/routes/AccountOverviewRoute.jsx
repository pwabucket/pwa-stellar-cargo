import AccountImage from "@/components/AccountImage";
import AssetValueMask from "@/components/AssetValueMask";
import useAppStore from "@/store/useAppStore";
import useTotalAssetsPriceQuery from "@/hooks/useTotalAssetsPriceQuery";
import {
  HiEye,
  HiOutlineArrowPath,
  HiOutlineInformationCircle,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlineQrCode,
} from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router";
import { cn, copyToClipboard, truncatePublicKey } from "@/lib/utils";
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

const ToolLink = ({
  icon: Icon, // eslint-disable-line no-unused-vars
  title,
  ...props
}) => (
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
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue
  );
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
        <div
          className={cn(
            "flex flex-col gap-2 p-4 justify-center items-center",
            "text-center bg-blue-700 text-white rounded-2xl",
            "relative"
          )}
        >
          {/* Account Name */}
          <div className="flex items-center gap-2 pl-11 w-full">
            <h2 className="text-2xl font-light truncate grow min-w-0 flex gap-2 justify-center items-center">
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
                "shrink-0 bg-blue-600 size-9",
                "flex items-center justify-center",
                "rounded-full"
              )}
            >
              <HiOutlinePencilSquare className="size-5" />
            </Link>
          </div>

          {totalAssetsPriceQuery.isSuccess ? (
            <div className="flex justify-center items-center gap-2 pl-8">
              <p className="text-3xl font-bold min-w-0">
                <AssetValueMask value={totalAssetsPrice} maskLength={10} />
              </p>
              <button className="shrink-0" onClick={toggleShowAssetValue}>
                <HiEye className="size-6" />
              </button>
            </div>
          ) : (
            <div className="bg-blue-600 rounded-full h-4 w-1/2 animate-pulse" />
          )}

          {/* Address */}
          <button
            onClick={() => copyToClipboard(account.publicKey)}
            className="flex items-center gap-2"
          >
            <IoCopyOutline className="size-4" />
            <h3 className="text-blue-100 truncate grow min-w-0 text-sm">
              {truncatePublicKey(account.publicKey, 8)}
            </h3>
          </button>
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

          <ToolLink
            target="_blank"
            title={"Details"}
            icon={HiOutlineInformationCircle}
            to={`https://stellar.expert/explorer/public/account/${account.publicKey}`}
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
