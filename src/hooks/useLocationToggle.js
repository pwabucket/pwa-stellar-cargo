import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMemo } from "react";

export default function useLocationToggle(key) {
  const navigate = useNavigate();
  const location = useLocation();
  const show = location.state?.[key] === true;

  /** Toggle Address Picker */
  const toggle = useCallback(
    (status) => {
      if (status) {
        navigate(null, {
          state: {
            ...location.state,
            [key]: true,
          },
        });
      } else {
        navigate(-1, { replace: true });
      }
    },
    [key, navigate, location.state]
  );

  return useMemo(() => [show, toggle], [show, toggle]);
}
