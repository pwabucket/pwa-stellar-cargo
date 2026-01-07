import Decimal from "decimal.js";
import clsx from "clsx";
import copy from "copy-to-clipboard";
import createStellarIdenticon from "stellar-identicon-js/index";
import repeatElement from "repeat-element";
import toast from "react-hot-toast";
import { Fragment } from "react";
import { createElement } from "react";
import { twMerge } from "tailwind-merge";

import { maxXLMPerTransaction } from "./stellar/transactions";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function error(code, options) {
  return {
    ...options,
    code,
  };
}

export function repeatComponent(component, times = 1) {
  return repeatElement(undefined, times).map((_, i) =>
    createElement(Fragment, { key: i, children: component })
  );
}

export function truncatePublicKey(publicKey, length = 4) {
  return publicKey.slice(0, length) + "..." + publicKey.slice(-length);
}

export function downloadFile(name, content) {
  const href = `data:application/octet-stream;base64,${btoa(content)}`;

  const a = document.createElement("a");

  a.download = name;
  a.href = href;

  a.click();
}

export function* chunkArrayGenerator(arr, size) {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
}

export function delay(length, precised = false) {
  return new Promise((res) => {
    setTimeout(
      () => res(),
      precised
        ? length
        : (length * (Math.floor(Math.random() * 50) + 100)) / 100
    );
  });
}

export function createAccountImage(publicKey, size = 64) {
  return createStellarIdenticon(publicKey, {
    width: size,
    height: size,
  }).toDataURL();
}

export function calculateXLMReserve(account) {
  const BASE_XLM_RESERVE = new Decimal("0.5");
  const reserveIsSponsored = Boolean(account["sponsor"]);

  let unfundedEntries = reserveIsSponsored ? 0 : 2;

  if (account["balances"]) {
    unfundedEntries += account["balances"].filter(
      (item) => item["asset_type"] !== "native" && !item["sponsor"]
    ).length;
  }

  if (account["signers"]) {
    unfundedEntries += account["signers"].filter(
      (item) => item["key"] !== account["id"] && !item["sponsor"]
    ).length;
  }

  return new Decimal(BASE_XLM_RESERVE).times(unfundedEntries);
}

export function copyToClipboard(content) {
  copy(content);
  toast.dismiss();
  toast.success("Copied!");
}

export function calculateAssetMaxAmount(
  asset,
  accountReserveBalance,
  transactionsCount = 1
) {
  const result =
    asset?.["asset_type"] === "native"
      ? new Decimal(asset?.["balance"] || 0)
          .minus(new Decimal(accountReserveBalance))
          .minus(new Decimal(calculateTransactionsFee(transactionsCount)))
      : new Decimal(asset?.["balance"]);
  return result.greaterThan(0) ? result : new Decimal(0);
}

export function calculateTransactionsFee(count) {
  return new Decimal(count).times(new Decimal(maxXLMPerTransaction)).toFixed(7);
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.async = true;
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);

    document.body.appendChild(script);
  });
}

export function getBasePath() {
  return import.meta.env.BASE_URL.startsWith("/")
    ? import.meta.env.BASE_URL
    : new URL(import.meta.env.BASE_URL).pathname;
}

export function getBaseURL(path = "") {
  return (
    (import.meta.env.BASE_URL.startsWith("/")
      ? new URL(import.meta.env.BASE_URL, location.href).href
      : import.meta.env.BASE_URL
    ).replace(/\/$/, "") + path
  );
}

export function searchProperties(
  list,
  search,
  properties = ["name", "publicKey", "address"]
) {
  return list.filter((item) =>
    properties.some((property) =>
      item[property]?.toLowerCase().includes(search.toLowerCase())
    )
  );
}

export function getClaimableAssets(claimables) {
  const map = new Map();
  for (const claimable of claimables) {
    const asset = claimable["asset"];
    const assetId =
      claimable.asset === "native" ? "XLM" : claimable.asset.replace(":", "-");

    if (map.has(assetId)) {
      const existing = map.get(assetId);
      existing.amount = existing.amount.plus(new Decimal(claimable["amount"]));
      existing.claimables.push(claimable);
      map.set(assetId, existing);
    } else {
      map.set(assetId, {
        asset,
        assetId,
        amount: new Decimal(claimable["amount"]),
        claimables: [claimable],
      });
    }
  }
  return Array.from(map.values()).map((item) => ({
    ["balance"]: item.amount.toFixed(7, Decimal.ROUND_DOWN),
    ["asset_id"]: item.assetId,
    ["asset_type"]: item.asset,
    ["asset_code"]: item.asset !== "native" ? item.asset.split(":")[0] : null,
    ["asset_issuer"]: item.asset !== "native" ? item.asset.split(":")[1] : null,

    ["transaction_name"]: item.asset,
  }));
}
