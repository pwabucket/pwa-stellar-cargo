import { findBackupFile } from "@/lib/google-drive";
import { useQuery } from "@tanstack/react-query";

export default function useGoogleBackupFileQuery(enabled) {
  return useQuery({
    enabled,
    queryKey: ["google-drive", "backup-file", enabled],
    queryFn: () => findBackupFile(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 15_000,
  });
}
