import { fetchAccount } from "@/lib/stellar/horizonQueries";
import { useQuery } from "@tanstack/react-query";

export default function useAccountQuery(publicKey, options) {
  return useQuery({
    ...options,
    queryKey: ["account", publicKey],
    queryFn: () => fetchAccount(publicKey),
  });
}
