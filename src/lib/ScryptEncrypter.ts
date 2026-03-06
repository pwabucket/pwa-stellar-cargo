import * as Comlink from "comlink";

import EncrypterWorker from "../workers/EncrypterWorker?worker";
import type {
  Encrypter,
  ScryptEncrypter,
} from "@stellar/typescript-wallet-sdk-km";

const worker = new EncrypterWorker();
const link = Comlink.wrap<typeof ScryptEncrypter>(worker);

export default {
  name: "ScryptEncrypter",
  encryptKey: (params) => link.encryptKey(params),
  decryptKey: (params) => link.decryptKey(params),
} satisfies Encrypter;
