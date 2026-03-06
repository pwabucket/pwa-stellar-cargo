import type { AppContextValue } from "@/types/index.d.ts";
import { createContext } from "react";

export default createContext<AppContextValue>({} as AppContextValue);
