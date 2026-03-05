import ClaimableStakeItem from "@/components/ClaimableStakeItem";

export default function ClaimableStakesList({ stakes, assetName }) {
  return (
    <div className="flex flex-col">
      <h4 className="px-2 py-1 text-sm font-bold text-slate-400 uppercase tracking-wide">
        Stakes
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
