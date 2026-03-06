import type { EncryptedKey } from "@stellar/typescript-wallet-sdk-km";
import type { Account, Contact } from "./account";

/** Google OAuth token stored in zustand */
export interface GoogleToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  [key: string]: unknown;
}

/** Google Drive backup file metadata */
export interface BackupFile {
  id: string;
  name: string;
  modifiedTime: string;
}

/** Backup content structure */
export interface BackupContent {
  updatedAt: number;
  data: {
    keys: EncryptedKey[];
    accounts: Account[];
    contacts: Contact[];
  };
}

/** Google API hook return type */
export interface GoogleApi {
  getUserInfo: () => Promise<gapi.client.oauth2.Userinfo>;
  refetchToken: () => Promise<GoogleToken>;
  getValidToken: () => Promise<string | GoogleToken>;
  requestAccessToken: () => Promise<GoogleToken>;
  logout: () => Promise<void>;
  initialized: boolean;
  authorized: boolean;
}

/** Google Drive Backup hook return type */
export interface GoogleDriveBackup {
  authorize: (options: {
    prompt: (value: BackupFile) => Promise<boolean>;
    forceRestore?: boolean;
  }) => Promise<void>;
  backupToDrive: () => Promise<void>;
  restoreBackup: (remoteBackupFile: BackupFile) => Promise<void>;
  importDriveBackup: (content: BackupContent) => Promise<void>;
}
