import { useEffect } from "react";

export default function useResizeForPWA(): void {
  useEffect(() => {
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
      document.referrer === "";

    if (isPWA) {
      window.resizeTo(400, Math.min(768, window.screen.availHeight));
    }
  }, []);
}
