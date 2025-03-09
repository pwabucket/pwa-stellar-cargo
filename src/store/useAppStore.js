import { combine, persist } from "zustand/middleware";
import { create } from "zustand";

export const THEMES = ["system", "light", "dark"];

const useAppStore = create()(
  persist(
    combine(
      { pinCode: "", isLoggedIn: false, theme: THEMES[0], accounts: [] },
      (set, get) => ({
        addAccount: (account) =>
          set({ accounts: [...get().accounts, account] }),
        removeAccount: (publicKey) =>
          set({
            accounts: get().accounts.filter(
              (item) => item.publicKey !== publicKey
            ),
          }),
        updateAccount: (data) =>
          set({
            accounts: get().accounts.map((item) =>
              item.publicKey === data.publicKey ? data : item
            ),
          }),

        setAccounts: (accounts) => set({ accounts }),
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set({
            theme: THEMES[(THEMES.indexOf(get().theme) + 1) % THEMES.length],
          }),
        login: (pinCode) => set({ isLoggedIn: true, pinCode }),
        logout: () => set({ isLoggedIn: false, pinCode: "" }),
      })
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:app`,
      partialize({ theme, accounts }) {
        return { theme, accounts };
      },
    }
  )
);

export default useAppStore;
