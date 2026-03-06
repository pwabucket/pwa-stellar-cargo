import type {
  BaseNetWorth,
  HorizonAccount,
  HorizonBalance,
} from "@/types/index.d.ts";

import type { UseQueryOptions } from "@tanstack/react-query";
import useAppStore from "@/store/useAppStore";
import useBaseNetWorth from "./useBaseNetWorth";
import { useMemo } from "react";
import useTotalAccountsQuery from "./useTotalAccountsQuery";

const queryOptions: Partial<UseQueryOptions<HorizonAccount | null>> = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchInterval: 30_000,
};

export default function useNetWorth(): BaseNetWorth {
  const accounts = useAppStore((state) => state.accounts);
  const list = useMemo(
    () => accounts.map((account) => account.publicKey),
    [accounts],
  );

  const totalAccountsQuery = useTotalAccountsQuery(list, queryOptions);
  const totalAssets = useMemo(
    () =>
      totalAccountsQuery.data?.reduce(
        (result, current) => result.concat(current?.balances || []),
        [] as HorizonBalance[],
      ) || [],
    [totalAccountsQuery.data],
  );

  const base = useBaseNetWorth(totalAssets);

  return {
    ...base,
    isSuccess: totalAccountsQuery.isSuccess && base.isSuccess,
  };
}
