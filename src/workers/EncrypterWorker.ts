import * as Comlink from "comlink";

import { ScryptEncrypter } from "@stellar/typescript-wallet-sdk-km";

Comlink.expose(ScryptEncrypter);
