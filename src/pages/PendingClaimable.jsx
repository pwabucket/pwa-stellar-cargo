import AccountAsset from "@/components/AccountAsset";
import { Link } from "react-router";
import { useOutletContext } from "react-router";

export default function PendingClaimable() {
  const { pendingClaimable } = useOutletContext();

  return (
    <div className="flex flex-col">
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
