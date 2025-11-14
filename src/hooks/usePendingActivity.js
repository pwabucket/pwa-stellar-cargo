import useAppStore from "@/store/useAppStore";
import { useEffect } from "react";

/* Track active pending activities */
let activeCount = 0;

const usePendingActivity = (status = false) => {
  const setIsProcessing = useAppStore((state) => state.setIsProcessing);

  useEffect(() => {
    if (status) {
      activeCount++;
      setIsProcessing(true);
    }

    return () => {
      if (status) {
        activeCount--;
        if (activeCount === 0) {
          setIsProcessing(false);
        }
      }
    };
  }, [status, setIsProcessing]);
};

export default usePendingActivity;
