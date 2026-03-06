import type {
  BaseNetWorth,
  ClaimableAsset,
  HorizonClaimableBalance,
} from "@/types/index.d.ts";

import type { UseQueryOptions } from "@tanstack/react-query";
import { getClaimableAssets } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";
import useBaseNetWorth from "./useBaseNetWorth";
import { useMemo } from "react";
import useTotalAccountsPendingClaimableQuery from "./useTotalAccountsPendingClaimableQuery";

const queryOptions: Partial<UseQueryOptions<HorizonClaimableBalance[] | null>> =
  {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30_000,
  };

export default function usePendingClaimableNetWorth(): BaseNetWorth {
  const accounts = useAppStore((state) => state.accounts);
  const list = useMemo(
    () => accounts.map((account) => account.publicKey),
    [accounts],
  );

  const totalPendingClaimableQuery = useTotalAccountsPendingClaimableQuery(
    list,
    queryOptions,
  );
  const totalAssets = useMemo(
    () =>
      totalPendingClaimableQuery.data?.reduce(
        (result, current) => result.concat(getClaimableAssets(current || [])),
        [] as ClaimableAsset[],
      ) || [],
    [totalPendingClaimableQuery.data],
  );

  const base = useBaseNetWorth(totalAssets);

  return {
    ...base,
    isSuccess: totalPendingClaimableQuery.isSuccess && base.isSuccess,
  };
}
