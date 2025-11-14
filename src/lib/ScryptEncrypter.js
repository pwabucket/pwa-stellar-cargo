import * as Comlink from "comlink";

import EncrypterWorker from "../workers/EncrypterWorker?worker";

const worker = new EncrypterWorker();
const link = Comlink.wrap(worker);

export default {
  name: "ScryptEncrypter",
  encryptKey: (params) => link.encryptKey(params),
  decryptKey: (params) => link.decryptKey(params),
};
