import { BottomDialog } from "./BottomDialog";
import type { ClaimableAsset } from "@/types/index.d.ts";
import ClaimableStakesList from "@/components/ClaimableStakesList";
import { Dialog } from "@/components/Dialog";
import { PrimaryButton } from "@/components/Button";
import ReleaseCalculatorContent from "@/components/ReleaseCalculatorContent";
import { Tabs } from "radix-ui";
import { cn } from "@/lib/utils";
import useClaimableStakes from "@/hooks/useClaimableStakes";

interface ClaimableDetailDialogProps {
  asset: ClaimableAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function ClaimableDetailDialog({
  asset,
  open,
  onOpenChange,
  children,
}: ClaimableDetailDialogProps) {
  const assetName =
    asset?.["asset_type"] === "native"
      ? "XLM"
      : asset?.["asset_code"] || "Unknown Asset";

  const stakes = useClaimableStakes(asset);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
      <Dialog.Portal open={open}>
        <BottomDialog
          title={assetName + " Claimable"}
          description={"View stakes and release calculator for " + assetName}
        >
          {/* Tabs */}
          <Tabs.Root defaultValue="stakes" className="flex flex-col gap-3">
            <Tabs.List className="grid grid-cols-2">
              {["stakes", "calculator"].map((value) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className={cn(
                    "p-2",
                    "border-b-2 border-transparent",
                    "capitalize",
                    "data-[state=active]:border-blue-500",
                  )}
                >
                  {value}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="stakes">
              <ClaimableStakesList stakes={stakes} assetName={assetName} />
            </Tabs.Content>

            <Tabs.Content value="calculator">
              <ReleaseCalculatorContent stakes={stakes} assetName={assetName} />
            </Tabs.Content>
          </Tabs.Root>

          <Dialog.Close asChild>
            <PrimaryButton className="mt-1">Close</PrimaryButton>
          </Dialog.Close>
        </BottomDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
