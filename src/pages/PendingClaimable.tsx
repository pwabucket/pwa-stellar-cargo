import AccountAsset from "@/components/AccountAsset";
import type { AccountRouteContext } from "@/types/index.d.ts";
import { Link } from "react-router";
import { useOutletContext } from "react-router";

export default function PendingClaimable() {
  const { pendingClaimable } = useOutletContext<AccountRouteContext>();

  return (
    <div className="flex flex-col gap-1.5">
      {pendingClaimable.map((balance, index) => (
        <AccountAsset
          key={index}
          as={Link}
          to={`${balance["asset_id"]}`}
          asset={balance}
        />
      ))}
    </div>
  );
}
