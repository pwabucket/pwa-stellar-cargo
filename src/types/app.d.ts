/** Theme options */
export type Theme = "light" | "dark" | "system";

/** Alert variants */
export type AlertVariant = "info" | "warning" | "danger" | "success";

/** App error */
export interface AppError {
  code: number;
  message?: string;
  [key: string]: unknown;
}
