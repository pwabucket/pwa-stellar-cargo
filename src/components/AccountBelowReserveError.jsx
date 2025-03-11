import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function AccountBelowReserve({ accountReserveBalance }) {
  return (
    <p className={cn("p-2 text-center rounded-xl", "text-red-800 bg-red-100")}>
      Account is below reserve! Transactions are likely to fail. You need a
      minimum of <span className="font-bold">{accountReserveBalance} XLM</span>{" "}
      + transaction fees.
    </p>
  );
});
