import { Horizon, StrKey } from "@stellar/stellar-sdk";
import { error } from "@/lib/utils";

export const server = new Horizon.Server(import.meta.env.VITE_APP_HORIZON_URL);

export async function submit(transaction) {
  try {
    await server.submitTransaction(transaction);
  } catch (err) {
    throw error(400, {
      message: `${err.response?.data?.title} - ${err.response?.data.extras["result_codes"]["transaction"]}`,
    });
  }
}

export async function fetchAccount(publicKey) {
  if (StrKey.isValidEd25519PublicKey(publicKey)) {
    try {
      let account = await server.accounts().accountId(publicKey).call();
      return account;
    } catch (err) {
      throw error(err.response?.status ?? 400, {
        message: `${err.response?.data?.title} - ${err.response?.data?.detail}`,
      });
    }
  } else {
    throw error(400, { message: "invalid public key" });
  }
}

export async function fetchAccountBalances(publicKey) {
  const { balances } = await fetchAccount(publicKey);
  return balances;
}
