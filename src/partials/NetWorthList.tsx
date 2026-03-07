import { HiEye, HiOutlineChevronDown } from "react-icons/hi2";

import AssetValueMask from "@/components/AssetValueMask";
import { Collapsible } from "radix-ui";
import type Decimal from "decimal.js";
import type { NetWorthAsset } from "@/types/index.d.ts";
import { PiSpinnerGap } from "react-icons/pi";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

interface NetWorthListProps {
  isSuccess: boolean;
  assets: NetWorthAsset[];
  totalNetWorth: Decimal;
  renderItem?: (item: NetWorthAsset, content: ReactNode) => ReactNode;
}

export default function NetWorthList({
  isSuccess,
  assets,
  totalNetWorth,
  renderItem,
}: NetWorthListProps) {
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue,
  );

  const expandNetWorth = useAppStore((state) => state.expandNetWorth);
  const setExpandNetWorth = useAppStore((state) => state.setExpandNetWorth);

  return (
    <>
      {isSuccess ? (
        <>
          <div className="flex justify-center items-center gap-2 py-1">
            <button className="shrink-0" onClick={toggleShowAssetValue}>
              <HiEye className="size-6" />
            </button>
            <p className="text-3xl font-bold">
              <AssetValueMask value={totalNetWorth} maskLength={10} />
            </p>
            <span className="size-6 shrink-0" />
          </div>

          {/* Toggle */}
          <Collapsible.Root
            className="flex flex-col gap-2"
            open={expandNetWorth}
            onOpenChange={setExpandNetWorth}
          >
            <Collapsible.Trigger
              className={cn(
                "group flex items-center gap-2 justify-center rounded-full mx-auto",
                "text-sm font-bold",
                "bg-blue-300/50 hover:bg-blue-300/80 px-2 py-1 pr-4",
                "border-b-4 border-blue-500",
              )}
            >
              <HiOutlineChevronDown className="size-5 group-data-[state=open]:rotate-180 transition-transform duration-500" />
              {expandNetWorth ? "Hide" : "View"} Details
            </Collapsible.Trigger>
            <Collapsible.Content className="flex flex-col gap-1">
              {assets.map((item) => {
                const content = (
                  <div
                    key={item["asset_id"]}
                    className="flex gap-2 items-center px-3 py-1 bg-blue-300/60 rounded-xl"
                  >
                    {/* Image */}
                    <img
                      src={item["asset_icon"]}
                      className="size-5 rounded-full shrink-0"
                    />
                    <div className="flex flex-col grow min-w-0">
                      {/* Name */}
                      <h4 className="truncate font-bold">
                        {item["asset_name"]}
                      </h4>

                      {/* Domain */}
                      <p className="text-xs">{item["asset_domain"]}</p>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end text-right">
                      {/* Value */}
                      <p className="font-bold">
                        <AssetValueMask
                          value={item["balance"]}
                          maskLength={10}
                          prefix=""
                        />
                      </p>

                      {/* USD Value */}
                      <p className="text-black/70 text-sm">
                        <AssetValueMask value={item["usd_value"] || 0} />
                      </p>
                    </div>
                  </div>
                );

                return renderItem ? renderItem(item, content) : content;
              })}
            </Collapsible.Content>
          </Collapsible.Root>
        </>
      ) : (
        <>
          <PiSpinnerGap className="size-6 mx-auto animate-spin" />
        </>
      )}
    </>
  );
}
