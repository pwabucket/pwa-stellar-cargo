import { combine, persist } from "zustand/middleware";
import { create } from "zustand";

const useGoogleAuthStore = create()(
  persist(
    combine(
      {
        token: null,
        expiresAt: null,
        backupFile: null,
      },
      (set) => ({
        setBackupFile: (backupFile) => set({ backupFile }),
        setToken: (token) =>
          set({
            token,
            expiresAt: token ? Date.now() + token["expires_in"] * 1000 : null,
          }),
      })
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:google-auth`,
      partialize({ token, expiresAt, backupFile }) {
        return { token, expiresAt, backupFile };
      },
    }
  )
);

export default useGoogleAuthStore;
