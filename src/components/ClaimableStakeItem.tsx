import { cn, formatDate } from "@/lib/utils";
import { differenceInDays, isToday, startOfDay } from "date-fns";

import AssetValueMask from "@/components/AssetValueMask";
import type { ClaimableStake } from "@/types/index.d.ts";

interface ClaimableStakeItemProps {
  stake: ClaimableStake;
  assetName: string;
}

export default function ClaimableStakeItem({
  stake,
  assetName,
}: ClaimableStakeItemProps) {
  const durationDays =
    stake.createdAt && stake.releaseDate
      ? differenceInDays(
          startOfDay(new Date(stake.releaseDate)),
          startOfDay(new Date(stake.createdAt)),
        )
      : null;

  const releaseDate = stake.releaseDate ? new Date(stake.releaseDate) : null;

  const remainingDays = releaseDate
    ? Math.max(
        0,
        differenceInDays(startOfDay(releaseDate), startOfDay(new Date())),
      )
    : 0;

  const remainingLabel = !releaseDate
    ? "Now"
    : isToday(releaseDate) || remainingDays === 0
      ? "Today"
      : `${remainingDays}d`;

  return (
    <div
      className={cn("p-3 flex flex-col gap-1", "border-b border-neutral-900")}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold">
          <AssetValueMask prefix="" value={stake.amount} maskLength={10} />{" "}
          <span className="text-sm font-normal text-neutral-400">
            {assetName}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {durationDays != null && (
            <span className="text-xs font-normal text-neutral-400">
              {durationDays}d
            </span>
          )}
          <span
            className={cn(
              "text-xs font-normal",
              remainingDays === 0 ? "text-green-400" : "text-blue-400",
            )}
          >
            {remainingLabel}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-neutral-400">
        <span>
          Created:{" "}
          <span className="text-neutral-300">
            {formatDate(stake.createdAt)}
          </span>
        </span>
        <span>
          Release:{" "}
          <time
            dateTime={
              stake.releaseDate
                ? new Date(stake.releaseDate).toISOString()
                : new Date().toISOString()
            }
            className={cn(
              "text-neutral-300",
              !stake.releaseDate && "text-green-400",
            )}
          >
            {stake.releaseDate ? formatDate(stake.releaseDate) : "Now"}
          </time>
        </span>
        {stake.expiryDate && (
          <span>
            Expires:{" "}
            <time
              className="text-neutral-300"
              dateTime={new Date(stake.expiryDate).toISOString()}
            >
              {formatDate(stake.expiryDate)}
            </time>
          </span>
        )}
      </div>
    </div>
  );
}
