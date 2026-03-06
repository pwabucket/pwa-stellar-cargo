import type { Contact } from "@/types/index.d.ts";
import useAppStore from "@/store/useAppStore";
import { useMemo } from "react";

export default function useContact(id?: string): Contact | undefined {
  const list = useAppStore((state) => state.contacts);
  return useMemo(() => list.find((item) => item.id === id), [list, id]);
}
