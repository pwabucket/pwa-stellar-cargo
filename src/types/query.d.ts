/** Combined query result (useTotalAccountsQuery etc.) */
export interface CombinedQueryResult<T> {
  query: unknown[];
  data: (T | null | undefined)[];
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}
