import AccountAsset from "@/components/AccountAsset";
import { useOutletContext } from "react-router";

export default function PendingClaimable() {
  const { pendingClaimable } = useOutletContext();

  return (
    <div className="flex flex-col">
      {pendingClaimable.map((balance, index) => (
        <AccountAsset key={index} asset={balance} />
      ))}
    </div>
  );
}
