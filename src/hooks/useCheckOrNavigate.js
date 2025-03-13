import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 *
 * @param {boolean} check
 * @param {import("react-router").To} to
 * @param {import("react-router").NavigateOptions} options
 */
export default function useCheckOrNavigate(check, to, options) {
  const navigate = useNavigate();
  /** Redirect */
  useEffect(() => {
    if (!check) {
      navigate(to, options);
    }
  }, [to, check, options, navigate]);
}
