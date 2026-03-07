import type { Account, Contact } from "./account";
import type { Theme } from "./app";
import type { BackupFile, GoogleToken } from "./google";

export interface AppStoreState {
  pinCode: string;
  isLoggedIn: boolean;
  isProcessing: boolean;
  showNetWorth: boolean;
  expandNetWorth: boolean;
  showAssetValue: boolean;
  theme: Theme;
  accounts: Account[];
  contacts: Contact[];
}

export interface AppStoreActions {
  addAccount: (account: Account) => void;
  removeAccount: (publicKey: string) => void;
  updateAccount: (data: Account) => void;
  setAccounts: (accounts: Account[]) => void;
  addContact: (contact: Contact) => void;
  removeContact: (id: string) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  setContacts: (contacts: Contact[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setShowNetWorth: (showNetWorth: boolean) => void;
  setExpandNetWorth: (expandNetWorth: boolean) => void;
  toggleShowNetWorth: () => void;
  toggleExpandNetWorth: () => void;
  setShowAssetValue: (showAssetValue: boolean) => void;
  toggleShowAssetValue: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  login: (pinCode: string) => void;
  logout: () => void;
}

export type AppStore = AppStoreState & AppStoreActions;

export interface GoogleAuthStoreState {
  token: GoogleToken | null;
  backupFile: BackupFile | null;
}

export interface GoogleAuthStoreActions {
  setBackupFile: (backupFile: BackupFile | null) => void;
  setToken: (token: GoogleToken | null) => void;
}

export type GoogleAuthStore = GoogleAuthStoreState & GoogleAuthStoreActions;
