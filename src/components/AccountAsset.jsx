import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function AccountAsset({
  as: Component = "div",
  asset,
  icon,
  domain,
  ...props
}) {
  return (
    <Component
      {...props}
      className={cn(
        "p-2 pr-3 rounded-xl",
        "bg-neutral-100 hover:bg-neutral-200",
        "dark:bg-neutral-800 dark:hover:bg-neutral-700",
        "flex items-center gap-2",
        props.className
      )}
    >
      {/* Icon */}
      <img
        src={icon}
        className={cn("shrink-0 size-8 rounded-full", "bg-white")}
      />

      {/* Asset Type */}
      <div className="flex flex-col grow min-w-0">
        {/* Name */}
        <h4 className=" truncate">
          {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
        </h4>

        {/* Domain */}
        <p className="text-xs">{domain}</p>
      </div>

      {/* Balance */}
      <p className="shrink-0 font-bold">
        {Intl.NumberFormat("en-US", {
          maximumFractionDigits: 20,
        }).format(asset["balance"])}
      </p>
    </Component>
  );
});
