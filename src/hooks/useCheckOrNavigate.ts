import type { NavigateOptions, To } from "react-router";

import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function useCheckOrNavigate(
  check: unknown,
  to: To | number,
  options?: NavigateOptions,
): void {
  const navigate = useNavigate();
  /** Redirect */
  useEffect(() => {
    if (!check) {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, options);
      }
    }
  }, [to, check, options, navigate]);
}
