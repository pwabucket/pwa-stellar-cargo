import Decimal from "decimal.js";
import { Fragment } from "react";
import clsx from "clsx";
import copy from "copy-to-clipboard";
import { createElement } from "react";
import createStellarIdenticon from "stellar-identicon-js/index";
import { maxXLMPerTransaction } from "./stellar/transactions";
import repeatElement from "repeat-element";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

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
    createElement(Fragment, { key: i, children: component }),
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
        : (length * (Math.floor(Math.random() * 50) + 100)) / 100,
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
      (item) => item["asset_type"] !== "native" && !item["sponsor"],
    ).length;
  }

  if (account["signers"]) {
    unfundedEntries += account["signers"].filter(
      (item) => item["key"] !== account["id"] && !item["sponsor"],
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
  transactionsCount = 1,
) {
  const result =
    asset?.["asset_type"] === "native"
      ? new Decimal(asset?.["balance"] || 0)
          .minus(new Decimal(accountReserveBalance))
          .minus(new Decimal(calculateTransactionsFee(transactionsCount)))
      : new Decimal(asset?.["balance"] || 0);
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
  properties = ["name", "publicKey", "address"],
) {
  return list.filter((item) =>
    properties.some((property) =>
      item[property]?.toLowerCase().includes(search.toLowerCase()),
    ),
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
    ...item,
    ["balance"]: item.amount.toFixed(7, Decimal.ROUND_DOWN),
    ["asset_id"]: item.assetId,
    ["asset_type"]: item.asset,
    ["asset_code"]: item.asset !== "native" ? item.asset.split(":")[0] : null,
    ["asset_issuer"]: item.asset !== "native" ? item.asset.split(":")[1] : null,
    ["transaction_name"]: item.asset,
  }));
}

/**
 * Extract the release date (not before) and expiry date (abs before)
 * from a claimable balance predicate for a given claimant.
 * @param {object} predicate - The claimant predicate from Horizon
 * @returns {{ releaseDate: string|null, expiryDate: string|null }}
 */
export function extractPredicateDates(predicate) {
  const dates = { releaseDate: null, expiryDate: null };

  function walk(pred) {
    if (!pred) return;

    if (pred["unconditional"] === true) return;

    // "not before X" means available after X (release date)
    if (pred["not"]) {
      const inner = pred["not"];
      if (inner["abs_before"]) {
        dates.releaseDate = inner["abs_before"];
      } else if (inner["abs_before_epoch"]) {
        dates.releaseDate = new Date(
          Number(inner["abs_before_epoch"]) * 1000,
        ).toISOString();
      } else {
        walk(inner);
      }
      return;
    }

    // Direct "abs_before" means must claim before (expiry)
    if (pred["abs_before"]) {
      dates.expiryDate = pred["abs_before"];
    } else if (pred["abs_before_epoch"]) {
      dates.expiryDate = new Date(
        Number(pred["abs_before_epoch"]) * 1000,
      ).toISOString();
    }

    // Recurse into and/or arrays
    if (pred["and"]) {
      pred["and"].forEach(walk);
    }
    if (pred["or"]) {
      pred["or"].forEach(walk);
    }
  }

  walk(predicate);
  return dates;
}

/**
 * Get the predicate dates for a specific claimant (publicKey)
 * from a claimable balance record.
 * @param {object} claimable - Raw Horizon claimable balance record
 * @param {string} publicKey - The claimant's public key
 * @returns {{ releaseDate: string|null, expiryDate: string|null }}
 */
export function getClaimableDates(claimable, publicKey) {
  const claimant = publicKey
    ? claimable.claimants?.find((c) => c.destination === publicKey)
    : claimable.claimants?.[0];
  if (!claimant) return { releaseDate: null, expiryDate: null };
  return extractPredicateDates(claimant.predicate);
}

/**
 * Format an ISO date string to a human-readable format.
 * @param {string|null} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
