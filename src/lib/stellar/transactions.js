import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

import { error } from "../utils";

export const maxFeePerOperation = BASE_FEE;
export const maxXLMPerTransaction = maxFeePerOperation / 10_000_000;
export const horizonUrl = import.meta.env.VITE_APP_HORIZON_URL;
export const networkPassphrase = Networks.PUBLIC;
export const standardTimebounds = 300;

export async function createPaymentTransaction({
  source,
  destination,
  asset,
  amount,
  memo,
}) {
  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);
  let transaction = new TransactionBuilder(sourceAccount, {
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
      if (err.response && err.response.status === 404) {
        destinationExists = false;
      } else {
        throw err; // unexpected error
      }
    }

    if (!destinationExists && asset === "native" && Number(amount) >= 1) {
      transaction.addOperation(
        Operation.createAccount({
          destination: path,
          startingBalance: amount.toString(),
        })
      );
    } else {
      transaction.addOperation(
        Operation.payment({
          destination: path,
          amount: amount.toString(),
          asset: sendAsset,
        })
      );
    }
  }

  let builtTransaction = transaction.setTimeout(standardTimebounds).build();

  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}

export function createFeeBumpTransaction({ sponsoringAccount, transaction }) {
  const feeBumpTransaction = TransactionBuilder.buildFeeBumpTransaction(
    sponsoringAccount,
    maxFeePerOperation,
    transaction,
    networkPassphrase
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
}) {
  let sendAsset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);
  let destAsset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1]
        );

  let destMin = (destinationAmount * 0.98).toFixed(7);

  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);
  let result = await server
    .strictSendPaths(sendAsset, sourceAmount.toString(), [destAsset])
    .call();

  let records = result.records
    .slice()
    .sort((a, b) => b["destination_amount"] - a["destination_amount"]);

  if (records.length === 0) {
    throw error(400, { message: "no strict send paths available" });
  }

  let transaction = new TransactionBuilder(sourceAccount, {
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
    })
  );

  let builtTransaction = transaction.setTimeout(standardTimebounds).build();
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
}) {
  let sendAsset =
    sourceAsset === "native"
      ? Asset.native()
      : new Asset(sourceAsset.split(":")[0], sourceAsset.split(":")[1]);

  let destAsset =
    destinationAsset === "native"
      ? Asset.native()
      : new Asset(
          destinationAsset.split(":")[0],
          destinationAsset.split(":")[1]
        );

  let sendMax = (sourceAmount * 0.98).toFixed(7);

  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);

  let result = await server
    .strictReceivePaths([sendAsset], destAsset, destinationAmount.toString())
    .call();

  let records = result.records
    .slice()
    .sort((a, b) => b["destination_amount"] - a["destination_amount"]);

  if (records.length === 0) {
    throw error(400, { message: "no strict receive paths available" });
  }

  let transaction = new TransactionBuilder(sourceAccount, {
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
      destAmount: destinationAmount,
      path: records[0].path.map((asset) => {
        return asset["asset_type"] === "native"
          ? Asset.native()
          : new Asset(asset["asset_code"], asset["asset_issuer"]);
      }),
    })
  );

  let builtTransaction = transaction.setTimeout(standardTimebounds).build();
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
}) {
  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);
  let transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

  const asset = new Asset(assetCode, assetIssuer);

  transaction.addOperation(
    Operation.changeTrust({
      asset,
      limit,
    })
  );

  let builtTransaction = transaction.setTimeout(standardTimebounds).build();
  return {
    transaction: builtTransaction.toXDR(),
    network_passphrase: networkPassphrase,
  };
}
