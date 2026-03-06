import type { GoogleApi, GoogleDriveBackup } from "./google";

/** App Context value */
export interface AppContextValue {
  googleApi: GoogleApi;
  googleDrive: GoogleDriveBackup;
  resetWallet: () => Promise<void>;
}
