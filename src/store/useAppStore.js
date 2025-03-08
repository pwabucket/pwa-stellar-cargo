import { combine, persist } from "zustand/middleware";
import { create } from "zustand";

const useAppStore = create()(
  persist(
    combine({ pinCode: "", isLoggedIn: false, accounts: [] }, (set, get) => ({
      addAccount: (account) => set({ accounts: [...get().accounts, account] }),
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
      login: (pinCode) => set({ isLoggedIn: true, pinCode }),
      logout: () => set({ isLoggedIn: false, pinCode: "" }),
    })),
    {
      name: `${import.meta.env.VITE_APP_ID}:app`,
      partialize({ accounts }) {
        return { accounts };
      },
    }
  )
);

export default useAppStore;
