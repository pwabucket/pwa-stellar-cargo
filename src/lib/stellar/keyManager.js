import {
  KeyManager,
  KeyType,
  LocalStorageKeyStore,
  ScryptEncrypter,
} from "@stellar/typescript-wallet-sdk-km";
import { TransactionBuilder } from "@stellar/stellar-sdk";

/** Setup Key Manager */
export const setupKeyManager = () => {
  const localKeyStore = new LocalStorageKeyStore();

  localKeyStore.configure({
    prefix: `${import.meta.env.VITE_APP_ID}:keys`,
    storage: localStorage,
  });

  const keyManager = new KeyManager({
    keyStore: localKeyStore,
  });

  keyManager.registerEncrypter(ScryptEncrypter);

  return keyManager;
};

/** Store Key */
export const storeKey = async ({ publicKey, secretKey, pinCode }) => {
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
export const loadKey = async (keyId, pinCode) => {
  const keyManager = setupKeyManager();
  return await keyManager.loadKey(keyId, pinCode);
};

/** Export All Keys */
export const exportAllKeys = async (pinCode) => {
  const keyManager = setupKeyManager();
  let keys = [];

  for (const id of await keyManager.loadAllKeyIds()) {
    keys.push(await keyManager.loadKey(id, pinCode));
  }

  return keys;
};

/** Remove Existing Keys */
export const removeAllKeys = async () => {
  const keyManager = setupKeyManager();
  for (const id of await keyManager.loadAllKeyIds()) {
    await keyManager.removeKey(id);
  }
};

/** Import Keys */
export const importAllKeys = async (keys, pinCode) => {
  const keyManager = setupKeyManager();
  for (const key of keys) {
    return await keyManager.storeKey({
      key,
      password: pinCode,
      encrypterName: ScryptEncrypter.name,
    });
  }
};

/** Sign Transaction */
export const signTransaction = async ({
  transactionXDR,
  network,
  keyId,
  pinCode,
}) => {
  const keyManager = setupKeyManager();
  const signedTransaction = await keyManager.signTransaction({
    transaction: TransactionBuilder.fromXDR(transactionXDR, network),
    id: keyId,
    password: pinCode,
  });
  return signedTransaction;
};
