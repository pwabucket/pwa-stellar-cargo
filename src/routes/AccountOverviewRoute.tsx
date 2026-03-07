import type { ComponentProps, ComponentType } from "react";
import {
  HiEye,
  HiEyeSlash,
  HiOutlineArrowPath,
  HiOutlineInformationCircle,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlineQrCode,
} from "react-icons/hi2";
import { Link, NavLink, Outlet, type NavLinkProps } from "react-router";
import { cn, copyToClipboard, truncatePublicKey } from "@/lib/utils";

import AccountImage from "@/components/AccountImage";
import type { AccountRouteContext } from "@/types/index.d.ts";
import AssetValueMask from "@/components/AssetValueMask";
import Decimal from "decimal.js";
import { IoCopyOutline } from "react-icons/io5";
import { motion } from "motion/react";
import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";
import { useOutletContext } from "react-router";
import useTotalAssetsPriceQuery from "@/hooks/useTotalAssetsPriceQuery";
import { PiSpinnerGap } from "react-icons/pi";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";

const PageNavLink = (props: NavLinkProps) => (
  <NavLink
    {...props}
    end
    className={({ isActive }) =>
      cn(
        "text-center",
        "rounded-full py-1 flex items-center justify-center",
        isActive && ["font-bold text-blue-300", "bg-neutral-900"],
      )
    }
  />
);

interface ToolLinkProps extends ComponentProps<typeof Link> {
  icon: ComponentType<{ className?: string }>;
  title: string;
}

const ToolLink = ({ icon: Icon, title, ...props }: ToolLinkProps) => (
  <Link
    {...props}
    className={cn(
      "flex flex-col justify-center items-center gap-1.5",
      "group",
      props.className,
    )}
  >
    <span
      className={cn(
        "bg-neutral-900",
        "flex justify-center items-center",
        "rounded-full size-12",
        "transition-all duration-200",
        "group-hover:bg-neutral-800 group-hover:scale-105",
        "group-active:scale-95",
      )}
    >
      <Icon className="size-6" />
    </span>
    <h5 className="text-xs font-medium">{title}</h5>
  </Link>
);

export default function AccountOverviewRoute() {
  const context = useOutletContext<AccountRouteContext>();
  const isLoggedIn = useIsLoggedIn();
  const showAssetValue = useAppStore((state) => state.showAssetValue);
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue,
  );
  const { account, balances } = context;

  /** Total Assets */
  const totalAssetsPriceQuery = useTotalAssetsPriceQuery(balances, {
    enabled: isLoggedIn && balances?.length > 0,
  });

  const totalAssetsPrice = useMemo(
    () =>
      totalAssetsPriceQuery.data?.reduce(
        (result, current) => result.plus(new Decimal(current || 0)),
        new Decimal(0),
      ),
    [totalAssetsPriceQuery.data],
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Card */}
        <div
          className={cn(
            "flex flex-col gap-2 p-4 justify-center items-center",
            "text-center bg-blue-400 text-black rounded-2xl",
            "relative",
          )}
        >
          {/* Account Name */}
          <div className="flex items-center gap-2 pl-11 w-full">
            <h2 className="text-2xl font-light truncate grow min-w-0 flex gap-2 justify-center items-center">
              <AccountImage
                publicKey={account.publicKey}
                className="size-10 shrink-0 rounded-full bg-white ring-2 ring-white/30"
              />{" "}
              {account.name || "Stellar Account"}
            </h2>

            {/* Edit Button */}
            <Link
              to={`edit`}
              className={cn(
                "shrink-0 size-9",
                "flex items-center justify-center",
                "rounded-full",
                "bg-white/25 hover:bg-white/35 active:bg-white/45",
                "transition-colors duration-200",
              )}
            >
              <HiOutlinePencilSquare className="size-5" />
            </Link>
          </div>

          {totalAssetsPriceQuery.isSuccess ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <motion.button
                  className={cn(
                    "shrink-0 p-1.5 rounded-full",
                    "bg-white/20 hover:bg-white/30 active:bg-white/40",
                    "transition-colors",
                  )}
                  onClick={toggleShowAssetValue}
                  whileTap={{ scale: 0.9 }}
                >
                  {showAssetValue ? (
                    <HiEye className="size-5" />
                  ) : (
                    <HiEyeSlash className="size-5" />
                  )}
                </motion.button>
                <p className="text-3xl font-bold tracking-tight min-w-0">
                  <AssetValueMask value={totalAssetsPrice} maskLength={10} />
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <PiSpinnerGap className="size-7 animate-spin text-black/60" />
            </div>
          )}

          {/* Address */}
          <button
            onClick={() => copyToClipboard(account.publicKey)}
            className={cn(
              "flex items-center gap-1.5",
              "bg-white/15 hover:bg-white/25",
              "rounded-full px-3 py-1",
              "transition-colors duration-200",
            )}
          >
            <IoCopyOutline className="size-3.5" />
            <h3 className="text-black/70 truncate grow min-w-0 text-xs font-medium">
              {truncatePublicKey(account.publicKey, 8)}
            </h3>
          </button>
        </div>

        <div className="flex gap-4 justify-center py-2">
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
        <div className="grid grid-cols-3 p-1 bg-neutral-900/50 rounded-full">
          {/* Assets */}
          <PageNavLink replace to={`/accounts/${account.publicKey}`}>
            Assets
          </PageNavLink>

          {/* Pending Claimable */}
          <PageNavLink replace to={`/accounts/${account.publicKey}/claimable`}>
            Claimable
          </PageNavLink>

          {/* Transactions */}
          <PageNavLink to={`/accounts/${account.publicKey}/transactions`}>
            Transactions
          </PageNavLink>
        </div>

        <Outlet context={context} />
      </div>
    </>
  );
}
