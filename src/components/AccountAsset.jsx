import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function AccountAsset({
  as: Component = "div",
  asset,
  displayPrice = true,
  ...props
}) {
  const assetPriceQuery = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"],
    asset?.["asset_issuer"],
    asset?.["balance"],
    {
      enabled: displayPrice,
    }
  );
  const assetValue = assetPriceQuery.data;

  return (
    <Component
      {...props}
      className={cn(
        "p-2 pr-3 rounded-xl text-left",
        "bg-neutral-100 hover:bg-neutral-200",
        "dark:bg-neutral-800 dark:hover:bg-neutral-700",
        "flex items-center gap-2",
        "disabled:opacity-60",
        props.className
      )}
    >
      {/* Icon */}
      <img
        src={asset["asset_icon"]}
        className={cn("shrink-0 size-8 rounded-full", "bg-white")}
      />

      {/* Asset Type */}
      <div className="flex flex-col grow min-w-0">
        {/* Name */}
        <h4 className=" truncate">
          {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
        </h4>

        {/* Domain */}
        <p className="text-xs">{asset["asset_domain"]}</p>
      </div>

      {/* Balance */}
      <div className="flex flex-col min-w-1/5 items-end shrink-0">
        <p className="font-bold text-right">
          {Intl.NumberFormat("en-US", {}).format(asset["balance"])}
        </p>
        {assetPriceQuery.isSuccess ? (
          <p className="text-right text-neutral-500 text-sm">
            ~${Intl.NumberFormat().format(assetValue)}
          </p>
        ) : (
          <div className="rounded-full w-3/5 h-2 bg-neutral-200 dark:bg-neutral-700" />
        )}
      </div>
    </Component>
  );
});
