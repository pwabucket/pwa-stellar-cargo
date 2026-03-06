import useAppStore from "@/store/useAppStore";
import { useCallback } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const EVENTS = [
  "mousemove",
  "mousedown",
  "mouseup",
  "keydown",
  "keyup",
  "click",
  "scroll",
  "touchstart",
  "touchmove",
  "touchend",
  "wheel",
  "focus",
  "blur",
  "visibilitychange",
];

export default function useInactivity(duration: number): void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const isProcessing = useAppStore((state) => state.isProcessing);
  const logout = useAppStore((state) => state.logout);

  /** Callback to Reset Timeout */
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(logout, duration);
  }, [logout, duration]);

  /** Register Effect */
  useEffect(() => {
    if (isProcessing || !isLoggedIn) return;

    /** Register Events */
    EVENTS.forEach(function (name) {
      window.addEventListener(name, resetTimer, true);
    });

    /** Initial Timeout  */
    timeoutRef.current = setTimeout(logout, duration);

    return () => {
      /** Remove Events */
      EVENTS.forEach(function (name) {
        window.removeEventListener(name, resetTimer, true);
      });

      /** Reset Timeout */
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [duration, isProcessing, isLoggedIn, resetTimer, logout]);
}
