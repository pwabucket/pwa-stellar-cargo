import { Asset, Horizon, StrKey } from "@stellar/stellar-sdk";
import { error } from "@/lib/utils";

export const server = new Horizon.Server(import.meta.env.VITE_APP_HORIZON_URL);
export const USDC = new Asset(
  "USDC",
  "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
);

export async function fetchAssetPrice(assetCode, assetIssuer, amount) {
  try {
    if (amount > 0) {
      const sellingAsset =
        assetCode === "XLM"
          ? new Asset.native()
          : new Asset(assetCode, assetIssuer);

      const response = await server
        .strictSendPaths(sellingAsset, amount.toString(), [USDC])
        .call();

      if (response.records.length > 0) {
        return response.records[0]["destination_amount"];
      } else {
        throw error(400, { message: "no strict send paths available" });
      }
    } else {
      return null;
    }
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

export async function findStrictSendPaths({
  sourceAsset,
  sourceAmount,
  destinationAsset,
  destinationPublicKey,
}) {
  if (sourceAmount <= 0) {
    throw error(400, { message: "amount is less than or equal to zero" });
  }

  let destination = destinationAsset
    ? [
        destinationAsset === "native"
          ? Asset.native()
          : new Asset(
              destinationAsset.split(":")[0],
              destinationAsset.split(":")[1]
            ),
      ]
    : destinationPublicKey;

  let asset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);

  let response = await server
    .strictSendPaths(asset, sourceAmount.toString(), destination)
    .call();

  if (response.records.length > 0) {
    return response.records;
  } else {
    throw error(400, { message: "no strict send paths available" });
  }
}

export async function findStrictReceivePaths({
  sourcePublicKey,
  sourceAsset,
  destinationAsset,
  destinationAmount,
}) {
  if (destinationAmount <= 0) {
    throw error(400, { message: "amount is less than or equal to zero" });
  }

  let source = sourceAsset
    ? [
        sourceAsset === "native"
          ? Asset.native()
          : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]),
      ]
    : sourcePublicKey;

  let asset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1]
        );

  let response = await server
    .strictReceivePaths(source, asset, destinationAmount.toString())
    .call();

  if (response.records.length > 0) {
    return response.records;
  } else {
    throw error(400, { message: "no strict receive paths available" });
  }
}
