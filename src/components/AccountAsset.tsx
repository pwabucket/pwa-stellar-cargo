import type { DynamicComponent, EnrichedBalance } from "@/types/index.d.ts";

import AssetValueMask from "./AssetValueMask";
import { cn } from "@/lib/utils";
import { memo } from "react";
import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";

interface AccountAssetProps {
  asset: EnrichedBalance;
  displayPrice?: boolean;
}

export default memo(function AccountAsset({
  as: Component = "div",
  asset,
  displayPrice = true,
  ...props
}) {
  const assetPriceQuery = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"] || "",
    asset?.["asset_issuer"] || "",
    asset?.["balance"] || "0",
    {
      enabled: displayPrice,
    },
  );
  const assetValue = assetPriceQuery.data || "0";

  return (
    <Component
      {...props}
      className={cn(
        "p-2 pr-3 text-left rounded-xl",
        "bg-neutral-900",
        "hover:bg-neutral-800",
        "flex items-center gap-2",
        "disabled:opacity-60",
        props.className,
      )}
    >
      {/* Icon */}
      <img
        src={asset["asset_icon"]}
        className={cn("shrink-0 size-8 rounded-full", "bg-white")}
      />

      {/* Asset Info */}
      <div className="flex flex-col grow min-w-0">
        {/* Name */}
        <h4 className="truncate">
          {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
        </h4>

        {/* Domain */}
        <p className="text-xs">{asset["asset_domain"]}</p>
      </div>

      {/* Balance */}
      <div className="flex flex-col min-w-1/5 items-end shrink-0">
        <p className="font-bold text-right">
          <AssetValueMask prefix="" value={asset["balance"]} maskLength={10} />
        </p>
        {assetPriceQuery.isSuccess ? (
          <p className="text-right text-neutral-500 text-sm">
            <AssetValueMask value={assetValue} />
          </p>
        ) : (
          <div className="rounded-full w-3/5 h-2 bg-neutral-700" />
        )}
      </div>
    </Component>
  );
}) as DynamicComponent<"div", AccountAssetProps>;
