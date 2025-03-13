import useNetWorth from "@/hooks/useNetWorth";
import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function NetWorth() {
  const { isSuccess, totalNetWorth } = useNetWorth();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-2xl",
        "bg-blue-600 text-white"
      )}
    >
      {isSuccess ? (
        <>
          <h3 className="text-sm">Net Worth</h3>
          <p className="text-3xl">
            ~${Intl.NumberFormat().format(totalNetWorth)}
          </p>
        </>
      ) : (
        <>
          <div className="bg-blue-400 rounded-full h-3 w-1/5" />
          <div className="bg-blue-400 rounded-full h-4 w-1/2" />
        </>
      )}
    </div>
  );
});
