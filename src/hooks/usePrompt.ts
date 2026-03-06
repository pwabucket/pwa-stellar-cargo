import { useCallback } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";

export default function usePrompt<
  TValue = unknown,
  TResolvedValue = unknown,
  TRejectedReason = unknown,
>() {
  const ref = useRef<{
    resolve: ((value: TResolvedValue) => void) | null;
    reject: ((reason?: TRejectedReason) => void) | null;
  }>({
    resolve: null,
    reject: null,
  });

  const [value, setValue] = useState<TValue | null>(null);
  const [show, setShow] = useState(false);

  const prompt = useCallback(
    (value: TValue) =>
      new Promise<TResolvedValue>((resolve, reject) => {
        ref.current = {
          resolve,
          reject,
        };
        setValue(value);
        setShow(true);
      }),
    [],
  );

  const resolve = useCallback(
    (value: TResolvedValue) => ref.current.resolve?.(value),
    [],
  );
  const reject = useCallback(
    (reason?: TRejectedReason) => ref.current.reject?.(reason),
    [],
  );

  return useMemo(
    () => ({ show, value, setShow, prompt, resolve, reject }),
    [show, value, setShow, prompt, resolve, reject],
  );
}
