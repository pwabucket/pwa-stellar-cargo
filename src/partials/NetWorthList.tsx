import { AnimatePresence, motion } from "motion/react";
import { HiEye, HiEyeSlash, HiOutlineChevronDown } from "react-icons/hi2";

import AssetValueMask from "@/components/AssetValueMask";
import { Collapsible } from "radix-ui";
import Decimal from "decimal.js";
import type { NetWorthAsset } from "@/types/index.d.ts";
import { PiSpinnerGap } from "react-icons/pi";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

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
  const showAssetValue = useAppStore((state) => state.showAssetValue);
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue,
  );

  const expandNetWorth = useAppStore((state) => state.expandNetWorth);
  const setExpandNetWorth = useAppStore((state) => state.setExpandNetWorth);

  /** Compute max USD value for proportional bars */
  const maxUsdValue = useMemo(() => {
    if (!assets.length) return new Decimal(1);
    const max = assets.reduce((acc, item) => {
      const val = new Decimal(item["usd_value"] || 0);
      return val.gt(acc) ? val : acc;
    }, new Decimal(0));
    return max.isZero() ? new Decimal(1) : max;
  }, [assets]);

  return (
    <>
      {isSuccess ? (
        <>
          {/* Total Value Display */}
          <div className="flex flex-col items-center gap-1 py-2">
            <div className="flex items-center gap-2">
              <motion.button
                className={cn(
                  "shrink-0 p-1.5 rounded-full",
                  "bg-white/20 hover:bg-white/30 active:bg-white/40",
                  "transition-colors",
                )}
                onClick={toggleShowAssetValue}
                whileTap={{ scale: 0.9 }}
              >
                {showAssetValue ? (
                  <HiEye className="size-5" />
                ) : (
                  <HiEyeSlash className="size-5" />
                )}
              </motion.button>
              <p className="text-3xl font-bold tracking-tight">
                <AssetValueMask value={totalNetWorth} maskLength={10} />
              </p>
            </div>
            {assets.length > 0 && (
              <p className="text-xs text-black/60 font-medium">
                {assets.length} asset{assets.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Collapsible Details */}
          <Collapsible.Root
            className="flex flex-col gap-2"
            open={expandNetWorth}
            onOpenChange={setExpandNetWorth}
          >
            <Collapsible.Trigger
              className={cn(
                "group flex items-center gap-1.5 justify-center mx-auto",
                "text-xs font-bold uppercase tracking-wider",
                "bg-white/25 hover:bg-white/35 px-4 py-1.5 rounded-full",
                "transition-all duration-300",
                "shadow-sm hover:shadow",
              )}
            >
              <motion.span
                animate={{ rotate: expandNetWorth ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="inline-flex"
              >
                <HiOutlineChevronDown className="size-4" />
              </motion.span>
              {expandNetWorth ? "Hide" : "Show"} Details
            </Collapsible.Trigger>

            <Collapsible.Content forceMount>
              <AnimatePresence initial={false}>
                {expandNetWorth && (
                  <motion.div
                    className="flex flex-col gap-1.5 overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {assets.map((item, index) => {
                      const usdVal = new Decimal(item["usd_value"] || 0);
                      const pct = usdVal.div(maxUsdValue).mul(100).toNumber();

                      const content = (
                        <motion.div
                          key={item["asset_id"]}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: index * 0.04,
                          }}
                          className={cn(
                            "relative flex gap-2.5 items-center px-3 py-2 rounded-xl",
                            "bg-white/25 hover:bg-white/35",
                            "transition-colors duration-200",
                            "overflow-hidden",
                          )}
                        >
                          {/* Percentage Fill Bar */}
                          <div
                            className="absolute inset-y-0 left-0 bg-blue-500/15 rounded-xl transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />

                          {/* Image */}
                          <img
                            src={item["asset_icon"]}
                            className="relative size-8 rounded-full shrink-0 ring-2 ring-white/30"
                          />
                          <div className="relative flex flex-col grow min-w-0">
                            {/* Name */}
                            <h4 className="truncate font-bold text-sm">
                              {item["asset_name"]}
                            </h4>

                            {/* Domain */}
                            <p className="text-xs text-black/55 truncate">
                              {item["asset_domain"]}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="relative flex flex-col items-end text-right shrink-0">
                            {/* Value */}
                            <p className="font-bold text-sm">
                              <AssetValueMask
                                value={item["balance"]}
                                maskLength={10}
                                prefix=""
                              />
                            </p>

                            {/* USD Value */}
                            <p className="text-black/60 text-xs">
                              <AssetValueMask value={item["usd_value"] || 0} />
                            </p>
                          </div>
                        </motion.div>
                      );

                      return renderItem ? renderItem(item, content) : content;
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapsible.Content>
          </Collapsible.Root>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 py-4">
          <PiSpinnerGap className="size-7 animate-spin text-black/60" />
          <p className="text-xs text-black/50 font-medium">
            Loading net worth...
          </p>
        </div>
      )}
    </>
  );
}
