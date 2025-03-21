import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

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

  paths.forEach((path) => {
    transaction.addOperation(
      Operation.payment({
        destination: path,
        amount: amount.toString(),
        asset: sendAsset,
      })
    );
  });

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
  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);
  let transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

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

  let destMin = ((98 * parseFloat(destinationAmount)) / 100).toFixed(7);

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
  let server = new Horizon.Server(horizonUrl);
  let sourceAccount = await server.loadAccount(source);
  let transaction = new TransactionBuilder(sourceAccount, {
    networkPassphrase: networkPassphrase,
    fee: maxFeePerOperation,
  });

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

  let sendMax = ((100 * parseFloat(sourceAmount)) / 98).toFixed(7);

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
