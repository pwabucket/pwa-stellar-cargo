import useAppStore from "@/store/useAppStore";
import { getClaimableAssets } from "@/lib/utils";
import { useMemo } from "react";
import useBaseNetWorth from "./useBaseNetWorth";
import useTotalAccountsPendingClaimableQuery from "./useTotalAccountsPendingClaimableQuery";

/**
 * @type {import("@tanstack/react-query").UseQueryOptions}
 */
const queryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 30_000,
};

export default function usePendingClaimableNetWorth() {
  const accounts = useAppStore((state) => state.accounts);
  const list = useMemo(
    () => accounts.map((account) => account.publicKey),
    [accounts]
  );

  const totalPendingClaimableQuery = useTotalAccountsPendingClaimableQuery(
    list,
    queryOptions
  );
  const totalAssets = useMemo(
    () =>
      totalPendingClaimableQuery.data?.reduce(
        (result, current) => result.concat(getClaimableAssets(current || [])),
        []
      ) || [],
    [totalPendingClaimableQuery.data]
  );

  const base = useBaseNetWorth(totalAssets);

  return {
    ...base,
    isSuccess: totalPendingClaimableQuery.isSuccess && base.isSuccess,
  };
}
