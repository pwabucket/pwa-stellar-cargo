import { KeyManager, KeyManagerPlugins, KeyType } from "@stellar/wallet-sdk";

export const setupKeyManager = () => {
  const localKeyStore = new KeyManagerPlugins.LocalStorageKeyStore();

  localKeyStore.configure({
    prefix: "stellar-cargo:keys",
    storage: localStorage,
  });

  const keyManager = new KeyManager({
    keyStore: localKeyStore,
  });

  keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter);

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
    encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
  });
};

export const loadKey = async (keyId, pinCode) => {
  const keyManager = setupKeyManager();
  return await keyManager.loadKey(keyId, pinCode);
};
