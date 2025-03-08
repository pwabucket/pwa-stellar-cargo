import {
  Asset,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const maxFeePerOperation = "100000";
const horizonUrl = import.meta.env.VITE_APP_HORIZON_URL;
const networkPassphrase = Networks.PUBLIC;
const standardTimebounds = 300;

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

  transaction.addOperation(
    Operation.payment({
      destination: destination,
      amount: amount.toString(),
      asset: sendAsset,
    })
  );

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
