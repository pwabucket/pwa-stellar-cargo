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

export function createAccountImage(publicKey) {
  return createStellarIdenticon(publicKey).toDataURL();
}

export function calculateXLMReserve(account) {
  const BASE_XLM_RESERVE = 0.5;
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

  return BASE_XLM_RESERVE * unfundedEntries;
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
      ? (
          asset?.["balance"] -
          accountReserveBalance -
          calculateTransactionsFee(transactionsCount)
        ).toFixed(7)
      : asset?.["balance"];
  return result > 0 ? result : 0;
}

export function calculateTransactionsFee(count) {
  return parseFloat((count * maxXLMPerTransaction).toFixed(7));
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
