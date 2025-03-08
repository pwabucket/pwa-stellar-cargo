import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function useCheckOrNavigate(check, to, options) {
  const navigate = useNavigate();
  /** Redirect */
  useEffect(() => {
    if (!check) {
      navigate(to, options);
    }
  }, [to, check, options, navigate]);
}
