import useNetWorth from "@/hooks/useNetWorth";
import { TbChartAreaLine } from "react-icons/tb";
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
      <h3 className="flex gap-1 items-center">
        <TbChartAreaLine className="size-5 inline" />
        Net Worth
      </h3>
      {isSuccess ? (
        <>
          <p className="text-3xl">
            ~${Intl.NumberFormat().format(totalNetWorth)}
          </p>
        </>
      ) : (
        <>
          <div className="bg-blue-500 rounded-full h-4 w-1/2 animate-pulse" />
        </>
      )}
    </div>
  );
});
