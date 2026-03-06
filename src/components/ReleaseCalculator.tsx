import type { ClaimableStake } from "@/types/index.d.ts";
import { Dialog } from "@/components/Dialog";
import { HiOutlineCalculator } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import ReleaseCalculatorContent from "@/components/ReleaseCalculatorContent";
import { cn } from "@/lib/utils";
import useLocationToggle from "@/hooks/useLocationToggle";

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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 transition duration-300 data-closed:opacity-0" />
        <Dialog.Content
          className={cn(
            "bg-slate-800 transition duration-300 data-closed:translate-y-full",
            "fixed z-50 inset-x-0 bottom-0 rounded-t-2xl",
            "max-h-3/4 overflow-auto",
            "flex flex-col",
          )}
          onOpenAutoFocus={(ev) => ev.preventDefault()}
        >
          <div
            className={cn("w-full max-w-md mx-auto p-4", "flex flex-col gap-3")}
          >
            <Dialog.Title className="text-center font-bold text-blue-500">
              Release Calculator
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Calculate total released by a date
            </Dialog.Description>

            <ReleaseCalculatorContent stakes={stakes} assetName={assetName} />

            <Dialog.Close asChild>
              <PrimaryButton className="mt-1">Close</PrimaryButton>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
