import { Asset, Horizon, StrKey } from "@stellar/stellar-sdk";
import { error } from "@/lib/utils";

export const server = new Horizon.Server(import.meta.env.VITE_APP_HORIZON_URL);
export const USDC = new Asset(
  "USDC",
  "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
);

export async function fetchAssetPrice(assetCode, assetIssuer) {
  try {
    const sellingAsset =
      assetCode === "XLM"
        ? new Asset.native()
        : new Asset(assetCode, assetIssuer);

    const orderBook = await server.orderbook(sellingAsset, USDC).call();

    return orderBook.asks.length > 0
      ? parseFloat(orderBook.asks[0].price)
      : null;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export async function submit(transaction) {
  try {
    return await server.submitTransaction(transaction);
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
