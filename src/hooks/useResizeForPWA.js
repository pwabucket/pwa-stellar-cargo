import { useEffect } from "react";

export default function () {
  useEffect(() => {
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer === "";

    if (isPWA) {
      window.resizeTo(400, Math.min(768, window.screen.availHeight));
    }
  }, []);
}
