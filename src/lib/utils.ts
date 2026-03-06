import Decimal from "decimal.js";
import { Fragment } from "react";
import type { ReactNode } from "react";
import clsx, { type ClassValue } from "clsx";
import copy from "copy-to-clipboard";
import { createElement } from "react";
import createStellarIdenticon from "stellar-identicon-js/index";
import { maxXLMPerTransaction } from "./stellar/transactions";
import repeatElement from "repeat-element";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import type {
  AppError,
  ClaimableAsset,
  HorizonAccount,
  HorizonBalance,
  HorizonClaimableBalance,
  PredicateDates,
} from "@/types/index.d.ts";
import type { AssetType } from "@stellar/stellar-sdk";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function error(
  code: number,
  options?: Record<string, unknown>,
): AppError {
  return {
    ...options,
    code,
  };
}

export function repeatComponent(
  component: ReactNode,
  times: number = 1,
): ReactNode[] {
  return repeatElement(undefined, times).map((_: unknown, i: number) =>
    createElement(Fragment, { key: i, children: component }),
  );
}

export function truncatePublicKey(
  publicKey: string,
  length: number = 4,
): string {
  return publicKey.slice(0, length) + "..." + publicKey.slice(-length);
}

export function downloadFile(name: string, content: string): void {
  const href = `data:application/octet-stream;base64,${btoa(content)}`;

  const a = document.createElement("a");

  a.download = name;
  a.href = href;

  a.click();
}

export function* chunkArrayGenerator<T>(
  arr: T[],
  size: number,
): Generator<T[]> {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size);
  }
}

export function delay(
  length: number,
  precised: boolean = false,
): Promise<void> {
  return new Promise((res) => {
    setTimeout(
      () => res(),
      precised
        ? length
        : (length * (Math.floor(Math.random() * 50) + 100)) / 100,
    );
  });
}

export function createAccountImage(
  publicKey: string,
  size: number = 64,
): string {
  return createStellarIdenticon(publicKey, {
    width: size,
    height: size,
  }).toDataURL();
}

export function calculateXLMReserve(account: HorizonAccount): Decimal {
  const BASE_XLM_RESERVE = new Decimal("0.5");
  const reserveIsSponsored = Boolean(account["sponsor"]);

  let unfundedEntries = reserveIsSponsored ? 0 : 2;

  if (account["balances"]) {
    unfundedEntries += account["balances"].filter(
      (item) =>
        item["asset_type"] !== "native" &&
        !("sponsor" in item && item["sponsor"]),
    ).length;
  }

  if (account["signers"]) {
    unfundedEntries += account["signers"].filter(
      (item) =>
        item["key"] !== account["id"] &&
        !("sponsor" in item && (item as Record<string, unknown>)["sponsor"]),
    ).length;
  }

  return new Decimal(BASE_XLM_RESERVE).times(unfundedEntries);
}

export function copyToClipboard(content: string): void {
  copy(content);
  toast.dismiss();
  toast.success("Copied!");
}

export function calculateAssetMaxAmount(
  asset: HorizonBalance | undefined | null,
  accountReserveBalance: Decimal | string | number,
  transactionsCount: number = 1,
): Decimal {
  const result =
    asset?.["asset_type"] === "native"
      ? new Decimal(asset?.["balance"] || 0)
          .minus(new Decimal(accountReserveBalance))
          .minus(new Decimal(calculateTransactionsFee(transactionsCount)))
      : new Decimal(asset?.["balance"] || 0);
  return result.greaterThan(0) ? result : new Decimal(0);
}

export function calculateTransactionsFee(count: number): string {
  return new Decimal(count).times(new Decimal(maxXLMPerTransaction)).toFixed(7);
}

export function loadScript(src: string): Promise<Event> {
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

export function getBasePath(): string {
  return import.meta.env.BASE_URL.startsWith("/")
    ? import.meta.env.BASE_URL
    : new URL(import.meta.env.BASE_URL).pathname;
}

export function getBaseURL(path: string = ""): string {
  return (
    (import.meta.env.BASE_URL.startsWith("/")
      ? new URL(import.meta.env.BASE_URL, location.href).href
      : import.meta.env.BASE_URL
    ).replace(/\/$/, "") + path
  );
}

export function searchProperties<T extends object>(
  list: T[],
  search: string,
  properties: (keyof T & string)[] = [
    "name",
    "publicKey",
    "address",
  ] as (keyof T & string)[],
): T[] {
  return list.filter((item) =>
    properties.some((property) =>
      (item[property] as string | undefined)
        ?.toLowerCase()
        .includes(search.toLowerCase()),
    ),
  );
}

export function getClaimableAssets(
  claimables: HorizonClaimableBalance[],
): ClaimableAsset[] {
  const map = new Map<
    string,
    {
      asset: string;
      assetId: string;
      amount: Decimal;
      claimables: HorizonClaimableBalance[];
    }
  >();

  for (const claimable of claimables) {
    const asset = claimable["asset"];
    const assetId =
      claimable.asset === "native" ? "XLM" : claimable.asset.replace(":", "-");

    if (map.has(assetId)) {
      const existing = map.get(assetId)!;
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
  return Array.from(map.values()).map(
    (item) =>
      ({
        ...item,
        ["balance"]: item.amount.toFixed(7, Decimal.ROUND_DOWN),
        ["asset_id"]: item.assetId,
        ["asset_type"]: item.asset as AssetType,
        ["asset_code"]: item.asset !== "native" ? item.asset.split(":")[0] : "",
        ["asset_issuer"]:
          item.asset !== "native" ? item.asset.split(":")[1] : "",
        ["transaction_name"]: item.asset,
      }) satisfies ClaimableAsset,
  );
}

/**
 * Extract the release date (not before) and expiry date (abs before)
 * from a claimable balance predicate for a given claimant.
 */
export function extractPredicateDates(
  predicate: Record<string, unknown>,
): PredicateDates {
  const dates: PredicateDates = { releaseDate: null, expiryDate: null };

  function walk(pred: Record<string, unknown> | undefined | null): void {
    if (!pred) return;

    if (pred["unconditional"] === true) return;

    // "not before X" means available after X (release date)
    if (pred["not"]) {
      const inner = pred["not"] as Record<string, unknown>;
      if (inner["abs_before"]) {
        dates.releaseDate = inner["abs_before"] as string;
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
      dates.expiryDate = pred["abs_before"] as string;
    } else if (pred["abs_before_epoch"]) {
      dates.expiryDate = new Date(
        Number(pred["abs_before_epoch"]) * 1000,
      ).toISOString();
    }

    // Recurse into and/or arrays
    if (pred["and"]) {
      (pred["and"] as Record<string, unknown>[]).forEach(walk);
    }
    if (pred["or"]) {
      (pred["or"] as Record<string, unknown>[]).forEach(walk);
    }
  }

  walk(predicate);
  return dates;
}

/**
 * Get the predicate dates for a specific claimant (publicKey)
 * from a claimable balance record.
 */
export function getClaimableDates(
  claimable: HorizonClaimableBalance,
  publicKey?: string | null,
): PredicateDates {
  const claimant = publicKey
    ? claimable.claimants?.find((c) => c.destination === publicKey)
    : claimable.claimants?.[0];
  if (!claimant) return { releaseDate: null, expiryDate: null };
  return extractPredicateDates(
    claimant.predicate as unknown as Record<string, unknown>,
  );
}

/**
 * Format an ISO date string to a human-readable format.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
