import { combine, persist } from "zustand/middleware";
import { create } from "zustand";

export const THEMES = ["light", "dark", "system"];

const useAppStore = create()(
  persist(
    combine(
      {
        pinCode: "",
        isLoggedIn: false,
        isProcessing: false,
        showNetWorth: false,
        showAssetValue: true,
        theme: THEMES[0],
        accounts: [],
        contacts: [],
      },
      (set, get) => ({
        /** Account Operations */
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

        /** Contact Operations */
        addContact: (contact) =>
          set({ contacts: [contact, ...get().contacts] }),
        removeContact: (id) =>
          set({
            contacts: get().contacts.filter((item) => item.id !== id),
          }),
        updateContact: (id, data) =>
          set({
            contacts: get().contacts.map((item) =>
              item.id === id ? { ...item, ...data } : item
            ),
          }),

        setContacts: (contacts) => set({ contacts }),

        /** Extras */
        setIsProcessing: (isProcessing) => set({ isProcessing }),

        /** Set Show Net Worth */
        setShowNetWorth: (showNetWorth) => set({ showNetWorth }),
        toggleShowNetWorth: () => set({ showNetWorth: !get().showNetWorth }),

        /** Set Show USD Value */
        setShowAssetValue: (showAssetValue) => set({ showAssetValue }),
        toggleShowAssetValue: () =>
          set({ showAssetValue: !get().showAssetValue }),

        /** Theme */
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set({
            theme: THEMES[(THEMES.indexOf(get().theme) + 1) % THEMES.length],
          }),

        /** Login and Logout */
        login: (pinCode) => set({ isLoggedIn: true, pinCode }),
        logout: () => set({ isLoggedIn: false, pinCode: "" }),
      })
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:app`,
      partialize({ theme, showNetWorth, showAssetValue, accounts, contacts }) {
        return { theme, showNetWorth, showAssetValue, accounts, contacts };
      },
    }
  )
);

export default useAppStore;
