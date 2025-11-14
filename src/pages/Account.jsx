import AccountAsset from "@/components/AccountAsset";
import AccountAssetPlaceholder from "@/components/AccountAssetPlaceholder";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { Link } from "react-router";
import { repeatComponent } from "@/lib/utils";
import { useOutletContext } from "react-router";

export default function Account() {
  const { balances, accountQuery } = useOutletContext();

  return (
    <div className="flex flex-col divide-y divide-neutral-900">
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

      {/* Add Trustline */}
      <div className="flex p-2 justify-center">
        <Link
          to={"trustlines/add"}
          className="text-blue-500 flex items-center gap-2"
        >
          <HiOutlinePlusCircle className="size-4" />
          Add Trustline
        </Link>
      </div>
    </div>
  );
}
