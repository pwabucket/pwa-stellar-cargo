import useNetWorth from "@/hooks/useNetWorth";
import NetWorthList from "./NetWorthList";

export default function ClaimedNetWorth() {
  const { isSuccess, assets, totalNetWorth } = useNetWorth();

  return (
    <NetWorthList
      isSuccess={isSuccess}
      assets={assets}
      totalNetWorth={totalNetWorth}
    />
  );
}
