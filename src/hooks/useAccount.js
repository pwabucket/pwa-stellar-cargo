import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

export default function useAccount(publicKey) {
  const list = useAppStore((state) => state.accounts);
  return useMemo(
    () => list.find((item) => item.publicKey === publicKey),
    [list, publicKey]
  );
}
