import { BottomDialog } from "./BottomDialog";
import type { ClaimableStake } from "@/types/index.d.ts";
import { Dialog } from "@/components/Dialog";
import { HiOutlineCalculator } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import ReleaseCalculatorContent from "@/components/ReleaseCalculatorContent";
import { useLocationToggle } from "@pwabucket/pwa-router";

interface ReleaseCalculatorProps {
  stakes: ClaimableStake[];
  assetName: string;
}

export default function ReleaseCalculator({
  stakes,
  assetName,
}: ReleaseCalculatorProps) {
  const [open, onOpenChange] = useLocationToggle("__showReleaseCalculator");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <PrimaryButton>
          <HiOutlineCalculator className="size-5" />
          Release Calculator
        </PrimaryButton>
      </Dialog.Trigger>

      <Dialog.Portal open={open}>
        <BottomDialog
          title="Release Calculator"
          description="Calculate total released by a date"
          className="h-auto"
        >
          <ReleaseCalculatorContent stakes={stakes} assetName={assetName} />

          <Dialog.Close asChild>
            <PrimaryButton className="mt-1">Close</PrimaryButton>
          </Dialog.Close>
        </BottomDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
