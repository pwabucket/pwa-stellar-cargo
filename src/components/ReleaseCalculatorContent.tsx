import { useMemo, useState } from "react";

import AssetValueMask from "@/components/AssetValueMask";
import type { ClaimableStake } from "@/types/index.d.ts";
import Decimal from "decimal.js";
import { Input } from "@/components/Input";
import { endOfDay } from "date-fns";
import { formatDate } from "@/lib/utils";

function toInputDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

interface ReleaseCalculatorContentProps {
  stakes: ClaimableStake[];
  assetName: string;
}

export default function ReleaseCalculatorContent({
  stakes,
  assetName,
}: ReleaseCalculatorContentProps) {
  const [selectedDate, setSelectedDate] = useState("");

  const releasedByDate = useMemo(() => {
    if (!selectedDate || !stakes.length) return null;

    const targetDate = endOfDay(new Date(selectedDate));

    const released = stakes.filter((stake) => {
      if (!stake.releaseDate) return true;
      return new Date(stake.releaseDate) <= targetDate;
    });

    const total = released.reduce(
      (sum, stake) => sum.plus(new Decimal(stake.amount)),
      new Decimal(0),
    );

    return {
      total: total.toFixed(7, Decimal.ROUND_DOWN),
      count: released.length,
    };
  }, [selectedDate, stakes]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-400 text-center">
        Choose a date to see the total amount released by that date.
      </p>

      <Input
        type="date"
        value={selectedDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSelectedDate(e.target.value)
        }
        min={toInputDate(stakes[0]?.createdAt)}
        className="bg-neutral-900"
      />

      {releasedByDate && (
        <div className="p-3 bg-neutral-900 rounded-xl flex flex-col gap-1">
          <p className="text-sm text-neutral-400">
            Total released by{" "}
            <span className="text-white font-medium">
              {formatDate(selectedDate + "T00:00:00Z")}
            </span>
          </p>
          <p className="text-2xl font-bold">
            <AssetValueMask
              prefix=""
              value={releasedByDate.total}
              maskLength={10}
            />{" "}
            <span className="text-base font-normal text-neutral-400">
              {assetName}
            </span>
          </p>
          <p className="text-xs text-neutral-400">
            {releasedByDate.count} of {stakes.length} stake
            {stakes.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
