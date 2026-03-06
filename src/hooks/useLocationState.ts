import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, type NavigateOptions } from "react-router";

export default function useLocationState<T>(
    key: string,
    defaultValue: T,
): [T, (value?: T, options?: NavigateOptions) => void] {
    const navigate = useNavigate();
    const location = useLocation();
    const value =
        typeof location.state?.[key] !== "undefined"
            ? location.state?.[key]
            : defaultValue;

    /** Set value */
    const setValue = useCallback(
        (newValue?: T, options?: NavigateOptions) => {
            if (typeof newValue !== "undefined") {
                navigate(location, {
                    ...options,
                    state: {
                        ...location.state,
                        ...options?.state,
                        [key]: newValue,
                    },
                });
            } else {
                if (location.key !== "default") {
                    navigate(-1);
                } else {
                    navigate("/", { ...options, replace: true });
                }
            }
        },
        [key, navigate, location],
    );

    return useMemo(() => [value, setValue], [value, setValue]);
}
