import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function error(code, data) {
  return {
    code,
    data,
  };
}

export function truncatePublicKey(publicKey, length = 4) {
  return publicKey.slice(0, length) + "..." + publicKey.slice(-length);
}
