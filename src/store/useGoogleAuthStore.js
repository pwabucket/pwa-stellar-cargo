import { combine, persist } from "zustand/middleware";
import { create } from "zustand";

const useGoogleAuthStore = create()(
  persist(
    combine(
      {
        token: null,
        backupFile: null,
      },
      (set) => ({
        setBackupFile: (backupFile) => set({ backupFile }),
        setToken: (token) => set({ token }),
      })
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:google-auth`,
      partialize({ token, backupFile }) {
        return { token, backupFile };
      },
    }
  )
);

export default useGoogleAuthStore;
