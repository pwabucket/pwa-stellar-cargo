import {
  KeyManager,
  KeyType,
  LocalStorageKeyStore,
  ScryptEncrypter,
} from "@stellar/typescript-wallet-sdk-km";
import { TransactionBuilder } from "@stellar/stellar-sdk";

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

export const loadKey = async (keyId, pinCode) => {
  const keyManager = setupKeyManager();
  return await keyManager.loadKey(keyId, pinCode);
};

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
