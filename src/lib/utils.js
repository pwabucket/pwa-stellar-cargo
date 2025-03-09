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
