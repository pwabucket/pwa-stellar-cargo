import AccountAsset from "@/components/AccountAsset";
import AccountAssetPlaceholder from "@/components/AccountAssetPlaceholder";
import type { AccountRouteContext } from "@/types/index.d.ts";
import { HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router";
import { cn, repeatComponent } from "@/lib/utils";
import { useOutletContext } from "react-router";

export default function Account() {
  const { balances, accountQuery } = useOutletContext<AccountRouteContext>();

  return (
    <div className="flex flex-col gap-1.5">
      {accountQuery.isSuccess
        ? balances.map((balance, index) => (
            <AccountAsset
              key={index}
              as={Link}
              to={`assets/${balance["asset_id"]}`}
              asset={balance}
            />
          ))
        : repeatComponent(<AccountAssetPlaceholder />, 4)}

      {/* Account Actions */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Add Trustline */}
        <Link
          to={"trustlines/add"}
          className={cn(
            "p-3 rounded-xl text-sm font-bold",
            "flex items-center justify-center gap-2",
            "bg-neutral-900 text-blue-400",
            "hover:bg-neutral-800 hover:text-blue-300",
            "transition-colors",
          )}
        >
          <HiOutlinePlusCircle className="size-5" />
          Add Trustline
        </Link>

        {/* Close Account */}
        <Link
          to={"close"}
          className={cn(
            "p-3 rounded-xl text-sm font-bold",
            "flex items-center justify-center gap-2",
            "text-red-400 border border-red-500/30",
            "hover:bg-red-500/10 hover:text-red-300",
            "transition-colors",
          )}
        >
          <HiOutlineTrash className="size-5" />
          Close Account
        </Link>
      </div>
    </div>
  );
}
