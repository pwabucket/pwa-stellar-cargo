import AppContext from "@/contexts/AppContext";
import type { AppContextValue } from "@/types/index.d.ts";
import { useContext } from "react";

export default function useAppContext(): AppContextValue {
  return useContext<AppContextValue>(AppContext);
}
