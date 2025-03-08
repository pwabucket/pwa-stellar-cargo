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
      login: (pinCode) => set({ isLoggedIn: true, pinCode }),
    })),
    {
      name: "stellar-cargo:app",
      partialize({ accounts }) {
        return { accounts };
      },
    }
  )
);

export default useAppStore;
