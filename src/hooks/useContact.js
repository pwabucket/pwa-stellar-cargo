import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

export default function useContact(id) {
  const list = useAppStore((state) => state.contacts);
  return useMemo(() => list.find((item) => item.id === id), [list, id]);
}
