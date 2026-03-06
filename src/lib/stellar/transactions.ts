import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import type { HorizonError, TransactionResult } from "@/types/index.d.ts";

import Decimal from "decimal.js";
import { error } from "../utils";

export const maxFeePerOperation = BASE_FEE;
export const maxXLMPerTransaction = new Decimal(maxFeePerOperation).dividedBy(
  "10_000_000",
);
export const horizonUrl = import.meta.env.VITE_APP_HORIZON_URL;
export const networkPassphrase = Networks.PUBLIC;
export const standardTimebounds = 300;

export async function createPaymentTransaction({
  source,
  destination,
  asset,
  amount,
  memo,
}: {
  source: string;
  destination: string | string[];
  asset: string;
  amount: Decimal.Value;
  memo?: string | Buffer;
}): Promise<TransactionResult> {
  const server = new Horizon.Server(horizonUrl);
  const sourceAccount = await server.loadAccount(source);
  const transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });
  let sendAsset;

  if (asset && asset !== "native") {
    sendAsset = new Asset(asset.split(":")[0], asset.split(":")[1]);
  } else {
    sendAsset = Asset.native();
  }

  if (memo) {
    if (typeof memo === "string") {
      transaction.addMemo(Memo.text(memo));
    } else if (typeof memo === "object") {
      transaction.addMemo(Memo.hash(memo.toString("hex")));
    }
  }

  const paths = Array.isArray(destination) ? destination : [destination];

  for (const path of paths) {
    let destinationExists = true;
    try {
      await server.loadAccount(path);
    } catch (err) {
      const e = err as HorizonError;
      if (e.response && e.response.status === 404) {
        destinationExists = false;
      } else {
        throw err; // unexpected error
      }
    }

    if (
      !destinationExists &&
      asset === "native" &&
      new Decimal(amount).greaterThanOrEqualTo(1)
    ) {
      transaction.addOperation(
        Operation.createAccount({
          destination: path,
          startingBalance: amount.toString(),
        }),
      );
    } else {
      transaction.addOperation(
        Operation.payment({
          destination: path,
          amount: amount.toString(),
          asset: sendAsset,
        }),
      );
    }
  }

  const builtTransaction = transaction.setTimeout(standardTimebounds).build();

  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}

export function createFeeBumpTransaction({
  sponsoringAccount,
  transaction,
}: {
  sponsoringAccount: string;
  transaction: Transaction;
}): TransactionResult {
  const feeBumpTransaction = TransactionBuilder.buildFeeBumpTransaction(
    sponsoringAccount,
    maxFeePerOperation,
    transaction,
    networkPassphrase,
  );

  return {
    transaction: feeBumpTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}

export async function createPathPaymentStrictSendTransaction({
  source,
  sourceAsset,
  sourceAmount,
  destination,
  destinationAsset,
  destinationAmount,
  memo,
}: {
  source: string;
  sourceAsset: string;
  sourceAmount: Decimal.Value;
  destination: string;
  destinationAsset: string;
  destinationAmount: Decimal.Value;
  memo?: string;
}): Promise<TransactionResult> {
  const sendAsset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);
  const destAsset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1],
        );

  const destMin = new Decimal(destinationAmount)
    .times("0.98")
    .toFixed(7, Decimal.ROUND_DOWN);

  const server = new Horizon.Server(horizonUrl);
  const sourceAccount = await server.loadAccount(source);
  const result = await server
    .strictSendPaths(sendAsset, sourceAmount.toString(), [destAsset])
    .call();

  const records = result.records
    .slice()
    .sort((a, b) =>
      new Decimal(b["destination_amount"])
        .minus(new Decimal(a["destination_amount"]))
        .toNumber(),
    );

  if (records.length === 0) {
    throw error(400, { message: "no strict send paths available" });
  }

  const transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

  if (memo) {
    transaction.addMemo(Memo.text(memo));
  }

  transaction.addOperation(
    Operation.pathPaymentStrictSend({
      sendAsset: sendAsset,
      sendAmount: sourceAmount.toString(),
      destination: destination,
      destAsset: destAsset,
      destMin: destMin,
      path: records[0].path.map((asset) => {
        return asset["asset_type"] === "native"
          ? Asset.native()
          : new Asset(asset["asset_code"], asset["asset_issuer"]);
      }),
    }),
  );

  const builtTransaction = transaction.setTimeout(standardTimebounds).build();
  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}

export async function createPathPaymentStrictReceiveTransaction({
  source,
  sourceAsset,
  sourceAmount,
  destination,
  destinationAsset,
  destinationAmount,
  memo,
}: {
  source: string;
  sourceAsset: string;
  sourceAmount: Decimal.Value;
  destination: string;
  destinationAsset: string;
  destinationAmount: Decimal.Value;
  memo?: string;
}): Promise<TransactionResult> {
  const sendAsset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);

  const destAsset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1],
        );

  const sendMax = new Decimal(sourceAmount)
    .times("0.98")
    .toFixed(7, Decimal.ROUND_DOWN);

  const server = new Horizon.Server(horizonUrl);
  const sourceAccount = await server.loadAccount(source);

  const result = await server
    .strictReceivePaths([sendAsset], destAsset, destinationAmount.toString())
    .call();

  const records = result.records
    .slice()
    .sort((a, b) =>
      new Decimal(b["destination_amount"])
        .minus(new Decimal(a["destination_amount"]))
        .toNumber(),
    );

  if (records.length === 0) {
    throw error(400, { message: "no strict receive paths available" });
  }

  const transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

  if (memo) {
    transaction.addMemo(Memo.text(memo));
  }

  transaction.addOperation(
    Operation.pathPaymentStrictReceive({
      sendAsset: sendAsset,
      sendMax: sendMax,
      destination: destination,
      destAsset: destAsset,
      destAmount: new Decimal(destinationAmount).toString(),
      path: records[0].path.map((asset) => {
        return asset["asset_type"] === "native"
          ? Asset.native()
          : new Asset(asset["asset_code"], asset["asset_issuer"]);
      }),
    }),
  );

  const builtTransaction = transaction.setTimeout(standardTimebounds).build();
  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}

export async function createTrustlineTransaction({
  source,
  assetCode,
  assetIssuer,
  limit = "922337203685.4775807",
}: {
  source: string;
  assetCode: string;
  assetIssuer: string;
  limit?: string;
}): Promise<TransactionResult> {
  const server = new Horizon.Server(horizonUrl);
  const sourceAccount = await server.loadAccount(source);
  const transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

  const asset = new Asset(assetCode, assetIssuer);

  transaction.addOperation(
    Operation.changeTrust({
      asset,
      limit,
    }),
  );

  const builtTransaction = transaction.setTimeout(standardTimebounds).build();
  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}
