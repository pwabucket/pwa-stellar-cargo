import type {
  EncryptedKey,
  Key,
  KeyMetadata,
} from "@stellar/typescript-wallet-sdk-km/lib/Types";
import {
  KeyManager,
  KeyType,
  LocalStorageKeyStore,
} from "@stellar/typescript-wallet-sdk-km";
import { Transaction, TransactionBuilder } from "@stellar/stellar-sdk";

import ScryptEncrypter from "../ScryptEncrypter";

/** Setup Key Store */
export const setupKeyStore = (): LocalStorageKeyStore => {
  const keyStore = new LocalStorageKeyStore();

  keyStore.configure({
    prefix: `${import.meta.env.VITE_APP_ID}:keys`,
    storage: localStorage,
  });

  return keyStore;
};

/** Setup Key Manager */
export const setupKeyManager = (): KeyManager => {
  const keyStore = setupKeyStore();

  const keyManager = new KeyManager({
    keyStore,
  });

  keyManager.registerEncrypter(ScryptEncrypter);

  return keyManager;
};

/** Store Key */
export const storeKey = async ({
  publicKey,
  secretKey,
  pinCode,
}: {
  publicKey: string;
  secretKey: string;
  pinCode: string;
}): Promise<KeyMetadata> => {
  const keyManager = setupKeyManager();

  return await keyManager.storeKey({
    key: {
      type: KeyType.plaintextKey,
      publicKey: publicKey,
      privateKey: secretKey,
    },
    password: pinCode,
    encrypterName: ScryptEncrypter.name,
  });
};

/** Load Key */
export const loadKey = async (keyId: string, pinCode: string): Promise<Key> => {
  const keyManager = setupKeyManager();
  return await keyManager.loadKey(keyId, pinCode);
};

/** Export All Keys */
export const exportAllKeys = async (pinCode: string): Promise<Key[]> => {
  const keyManager = setupKeyManager();
  const keys: Key[] = [];

  for (const id of await keyManager.loadAllKeyIds()) {
    keys.push(await keyManager.loadKey(id, pinCode));
  }

  return keys;
};

/** Export Encrypted Keys */
export const exportEncryptedKeys = async (): Promise<EncryptedKey[]> => {
  return setupKeyStore().loadAllKeys();
};

/** Remove Existing Keys */
export const removeAllKeys = async (): Promise<void> => {
  const keyStore = setupKeyStore();
  for (const key of await keyStore.loadAllKeys()) {
    await keyStore.removeKey(key.id);
  }
};

/** Import Keys */
export const importAllKeys = async (
  keys: Key[],
  pinCode: string,
): Promise<void> => {
  const keyManager = setupKeyManager();
  for (const key of keys) {
    await keyManager.storeKey({
      key,
      password: pinCode,
      encrypterName: ScryptEncrypter.name,
    });
  }
};

/** Import Encrypted Keys */
export const importEncryptedKeys = async (
  keys: EncryptedKey[],
): Promise<KeyMetadata[]> => {
  const keyStore = setupKeyStore();
  return keyStore.storeKeys(keys);
};

/** Sign Transaction */
export const signTransaction = async ({
  transactionXDR,
  network,
  keyId,
  pinCode,
}: {
  transactionXDR: string;
  network: string;
  keyId: string;
  pinCode: string;
}): Promise<Transaction> => {
  const keyManager = setupKeyManager();
  const signedTransaction = await keyManager.signTransaction({
    transaction: TransactionBuilder.fromXDR(
      transactionXDR,
      network,
    ) as Transaction,
    id: keyId,
    password: pinCode,
  });
  return signedTransaction;
};
