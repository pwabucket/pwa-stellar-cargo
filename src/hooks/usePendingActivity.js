import useAppStore from "@/store/useAppStore";
import { useEffect } from "react";

export default function usePendingActivity(status = false) {
  const setIsProcessing = useAppStore((state) => state.setIsProcessing);

  useEffect(() => {
    if (status !== useAppStore.getState().isProcessing) {
      setIsProcessing(status);
    }

    return () => {
      if (useAppStore.getState().isProcessing) {
        setIsProcessing(false);
      }
    };
  }, [status, setIsProcessing]);
}
