import AssetValueMask from "@/components/AssetValueMask";
import useAppStore from "@/store/useAppStore";
import useNetWorth from "@/hooks/useNetWorth";
import { HiEye } from "react-icons/hi2";
import { TbChartAreaLine } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function NetWorth() {
  const { isSuccess, totalNetWorth } = useNetWorth();
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue
  );

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
        <div className="flex items-center gap-2">
          <button className="shrink-0" onClick={toggleShowAssetValue}>
            <HiEye className="size-6" />
          </button>
          <p className="text-3xl font-bold">
            <AssetValueMask value={totalNetWorth} maskLength={10} />
          </p>
        </div>
      ) : (
        <>
          <div className="bg-blue-500 rounded-full h-4 w-1/2 animate-pulse" />
        </>
      )}
    </div>
  );
});
