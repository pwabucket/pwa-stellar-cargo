import { getClaimableDates } from "@/lib/utils";
import { useMemo } from "react";

export default function useClaimableStakes(claimableAsset, publicKey = null) {
  return useMemo(() => {
    if (!claimableAsset?.claimables) return [];

    return claimableAsset.claimables
      .map((claimable) => {
        const dates = getClaimableDates(claimable, publicKey);
        return {
          id: claimable.id,
          amount: claimable.amount,
          sponsor: claimable.sponsor,
          createdAt: claimable.last_modified_time,
          releaseDate: dates.releaseDate,
          expiryDate: dates.expiryDate,
        };
      })
      .sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return -1;
        if (!b.releaseDate) return 1;
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      });
  }, [claimableAsset, publicKey]);
}
