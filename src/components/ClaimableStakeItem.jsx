import { cn, formatDate } from "@/lib/utils";

import AssetValueMask from "@/components/AssetValueMask";

export default function ClaimableStakeItem({ stake, assetName }) {
  const durationDays =
    stake.createdAt && stake.releaseDate
      ? Math.round(
          (new Date(stake.releaseDate) - new Date(stake.createdAt)) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  return (
    <div className={cn("p-3 flex flex-col gap-1", "border-b border-slate-700")}>
      <div className="flex justify-between items-center">
        <span className="font-bold">
          <AssetValueMask prefix="" value={stake.amount} maskLength={10} />{" "}
          <span className="text-sm font-normal text-slate-400">
            {assetName}
          </span>
        </span>
        {durationDays != null && (
          <span className="text-xs font-normal text-blue-400 ml-1">
            {durationDays}d
          </span>
        )}
      </div>
      <div className="flex gap-4 text-xs text-slate-400">
        <span>
          Created:{" "}
          <span className="text-slate-300">{formatDate(stake.createdAt)}</span>
        </span>
        <span>
          Release:{" "}
          <span
            className={cn(
              "text-slate-300",
              !stake.releaseDate && "text-green-400",
            )}
          >
            {stake.releaseDate ? formatDate(stake.releaseDate) : "Now"}
          </span>
        </span>
        {stake.expiryDate && (
          <span>
            Expires:{" "}
            <span className="text-slate-300">
              {formatDate(stake.expiryDate)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
