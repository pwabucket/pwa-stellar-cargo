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
