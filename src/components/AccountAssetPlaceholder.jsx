import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function AccountAssetPlaceholder() {
  return (
    <div className={cn("p-2 pr-3", "flex items-center gap-2")}>
      {/* Icon */}
      <div className={cn("shrink-0 size-8 rounded-full", "bg-slate-700")} />

      {/* Asset Type */}
      <div className="flex flex-col gap-1 grow min-w-0">
        {/* Name */}
        <div className="rounded-full w-5/6 h-3 bg-slate-700" />

        {/* Domain */}
        <div className="rounded-full w-5/12 h-2 bg-slate-700" />
      </div>

      {/* Balance */}
      <div className="flex flex-col items-end gap-1 shrink-0 w-1/3">
        <div className="rounded-full w-2/4 h-3 bg-slate-700" />
        <div className="rounded-full w-1/4 h-2 bg-slate-700" />
      </div>
    </div>
  );
});
