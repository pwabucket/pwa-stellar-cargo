import usePendingClaimableNetWorth from "@/hooks/usePendingClaimableNetWorth";

import NetWorthList from "./NetWorthList";

export default function ClaimableNetWorth() {
  const { isSuccess, assets, totalNetWorth } = usePendingClaimableNetWorth();

  return (
    <NetWorthList
      isSuccess={isSuccess}
      assets={assets}
      totalNetWorth={totalNetWorth}
    />
  );
}
