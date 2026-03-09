import type { ClaimableStake } from "@/types/index.d.ts";
import ClaimableStakeItem from "@/components/ClaimableStakeItem";

interface ClaimableStakesListProps {
  stakes: ClaimableStake[];
  assetName: string;
}

export default function ClaimableStakesList({
  stakes,
  assetName,
}: ClaimableStakesListProps) {
  return (
    <div className="flex flex-col">
      <h4 className="px-2 py-1 text-sm text-center font-bold text-neutral-400 uppercase tracking-wide">
        Stakes ({stakes.length})
      </h4>
      {stakes.map((stake) => (
        <ClaimableStakeItem
          key={stake.id}
          stake={stake}
          assetName={assetName}
        />
      ))}
    </div>
  );
}
