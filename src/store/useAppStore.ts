import type {
  Account,
  AppStoreActions,
  AppStoreState,
  Contact,
  Theme,
} from "@/types/index.d.ts";
import { combine, persist } from "zustand/middleware";

import { create } from "zustand";

export const THEMES: Theme[] = ["light", "dark", "system"];

const EXCLUDED_KEYS = ["pinCode", "isLoggedIn", "isProcessing"];

const useAppStore = create<AppStoreState & AppStoreActions>()(
  persist(
    combine(
      {
        pinCode: "",
        isLoggedIn: false,
        isProcessing: false,
        showNetWorth: true,
        expandNetWorth: true,
        showAssetValue: true,
        theme: THEMES[0],
        accounts: [] as Account[],
        contacts: [] as Contact[],
      },
      (set, get) => ({
        /** Account Operations */
        addAccount: (account: Account) =>
          set({ accounts: [...get().accounts, account] }),
        removeAccount: (publicKey: string) =>
          set({
            accounts: get().accounts.filter(
              (item) => item.publicKey !== publicKey,
            ),
          }),
        updateAccount: (data: Account) =>
          set({
            accounts: get().accounts.map((item) =>
              item.publicKey === data.publicKey ? data : item,
            ),
          }),

        setAccounts: (accounts: Account[]) => set({ accounts }),

        /** Contact Operations */
        addContact: (contact: Contact) =>
          set({ contacts: [contact, ...get().contacts] }),
        removeContact: (id: string) =>
          set({
            contacts: get().contacts.filter((item) => item.id !== id),
          }),
        updateContact: (id: string, data: Partial<Contact>) =>
          set({
            contacts: get().contacts.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          }),

        setContacts: (contacts: Contact[]) => set({ contacts }),

        /** Extras */
        setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),

        /** Set Show Net Worth */
        setShowNetWorth: (showNetWorth: boolean) => set({ showNetWorth }),
        toggleShowNetWorth: () => set({ showNetWorth: !get().showNetWorth }),

        /** Set Expand Net Worth */
        setExpandNetWorth: (expandNetWorth: boolean) => set({ expandNetWorth }),
        toggleExpandNetWorth: () =>
          set({ expandNetWorth: !get().expandNetWorth }),

        /** Set Show USD Value */
        setShowAssetValue: (showAssetValue: boolean) => set({ showAssetValue }),
        toggleShowAssetValue: () =>
          set({ showAssetValue: !get().showAssetValue }),

        /** Theme */
        setTheme: (theme: Theme) => set({ theme }),
        toggleTheme: () =>
          set({
            theme:
              THEMES[
                (THEMES.indexOf(get().theme as Theme) + 1) % THEMES.length
              ],
          }),

        /** Login and Logout */
        login: (pinCode: string) => set({ isLoggedIn: true, pinCode }),
        logout: () => set({ isLoggedIn: false, pinCode: "" }),
      }),
    ),
    {
      name: `${import.meta.env.VITE_APP_ID}:app`,
      partialize(state) {
        return Object.fromEntries(
          Object.entries(state).filter(([key]) => !EXCLUDED_KEYS.includes(key)),
        );
      },
    },
  ),
);

export default useAppStore;
