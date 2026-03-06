import type {
  BackupFile,
  GoogleAuthStoreActions,
  GoogleAuthStoreState,
  GoogleToken,
} from "@/types/index.d.ts";
import { combine, persist } from "zustand/middleware";

import { create } from "zustand";

const useGoogleAuthStore = create<
  GoogleAuthStoreState & GoogleAuthStoreActions
>()(
  persist(
    combine(
      {
        token: null as GoogleToken | null,
        backupFile: null as BackupFile | null,
      },
      (set) => ({
        setBackupFile: (backupFile: BackupFile | null) => set({ backupFile }),
        setToken: (token: GoogleToken | null) => set({ token }),
      }),
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:google-auth`,
      partialize({ token, backupFile }) {
        return { token, backupFile };
      },
    },
  ),
);

export default useGoogleAuthStore;
