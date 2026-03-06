import {
  Asset,
  FeeBumpTransaction,
  Horizon,
  StrKey,
  Transaction,
} from "@stellar/stellar-sdk";

import Decimal from "decimal.js";
import type { HorizonError } from "@/types";
import { error } from "@/lib/utils";

export const server = new Horizon.Server(import.meta.env.VITE_APP_HORIZON_URL);
export const USDC = new Asset(
  "USDC",
  "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
);

export async function fetchAssetPrice(
  assetCode: string,
  assetIssuer: string,
  amount: Decimal.Value,
) {
  try {
    if (new Decimal(amount).gt(0)) {
      if (assetCode === USDC.getCode() && assetIssuer === USDC.getIssuer()) {
        return new Decimal(amount).toString();
      }

      const sellingAsset =
        assetCode === "XLM"
          ? Asset.native()
          : new Asset(assetCode, assetIssuer);

      const response = await server
        .strictSendPaths(sellingAsset, new Decimal(amount).toString(), [USDC])
        .call();

      if (response.records.length > 0) {
        return response.records[0]["destination_amount"];
      } else {
        throw error(400, { message: "no strict send paths available" });
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    return null;
  }
}

export async function submit(transaction: Transaction | FeeBumpTransaction) {
  try {
    return await server.submitTransaction(transaction);
  } catch (e) {
    const err = e as HorizonError;
    throw error(400, {
      message: `${err.response?.data?.title} - ${err.response?.data?.extras?.result_codes?.transaction}`,
    });
  }
}

export async function fetchAccount(publicKey: string) {
  if (StrKey.isValidEd25519PublicKey(publicKey)) {
    try {
      const account = await server.accounts().accountId(publicKey).call();
      return account;
    } catch (e) {
      const err = e as HorizonError;
      throw error(err.response?.status ?? 400, {
        message: `${err.response?.data?.title} - ${err.response?.data?.detail}`,
      });
    }
  } else {
    throw error(400, { message: "invalid public key" });
  }
}

export async function fetchPendingClaimable(publicKey: string) {
  if (StrKey.isValidEd25519PublicKey(publicKey)) {
    try {
      const records = [];
      let page = await server
        .claimableBalances()
        .claimant(publicKey)
        .limit(200)
        .call();

      while (true) {
        records.push(...page.records);

        if (!page.records.length) {
          break;
        }

        page = await page.next();
      }

      return records;
    } catch (e) {
      const err = e as HorizonError;
      throw error(err.response?.status ?? 400, {
        message: `${err.response?.data?.title} - ${err.response?.data?.detail}`,
      });
    }
  } else {
    throw error(400, { message: "invalid public key" });
  }
}

export async function fetchAccountBalances(publicKey: string) {
  const { balances } = await fetchAccount(publicKey);
  return balances;
}

export async function findStrictSendPaths({
  sourceAsset,
  sourceAmount,
  destinationAsset,
  destinationPublicKey = "",
}: {
  sourceAsset: string;
  sourceAmount: Decimal.Value;
  destinationAsset: string;
  destinationPublicKey?: string;
}) {
  if (new Decimal(sourceAmount).lte(0)) {
    throw error(400, { message: "amount is less than or equal to zero" });
  }

  const destination = destinationAsset
    ? [
        destinationAsset === "native"
          ? Asset.native()
          : new Asset(
              destinationAsset.split(":")[0],
              destinationAsset.split(":")[1],
            ),
      ]
    : destinationPublicKey;

  const asset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);

  const response = await server
    .strictSendPaths(asset, sourceAmount.toString(), destination)
    .call();

  if (response.records.length > 0) {
    return response.records;
  } else {
    throw error(400, { message: "no strict send paths available" });
  }
}

export async function findStrictReceivePaths({
  sourcePublicKey = "",
  sourceAsset,
  destinationAsset,
  destinationAmount,
}: {
  sourcePublicKey?: string;
  sourceAsset: string;
  destinationAsset: string;
  destinationAmount: Decimal.Value;
}) {
  if (new Decimal(destinationAmount).lte(0)) {
    throw error(400, { message: "amount is less than or equal to zero" });
  }

  const source = sourceAsset
    ? [
        sourceAsset === "native"
          ? Asset.native()
          : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]),
      ]
    : sourcePublicKey;

  const asset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1],
        );

  const response = await server
    .strictReceivePaths(source, asset, destinationAmount.toString())
    .call();

  if (response.records.length > 0) {
    return response.records;
  } else {
    throw error(400, { message: "no strict receive paths available" });
  }
}
