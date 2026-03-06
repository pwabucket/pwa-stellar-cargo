/** Stored account (persisted in zustand / Google Drive backup) */
export interface Account {
  keyId: string;
  name: string;
  publicKey: string;
}

/** Stored contact */
export interface Contact {
  id: string;
  name: string;
  address: string;
  memo: string;
}
