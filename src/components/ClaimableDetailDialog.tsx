import { BottomDialog } from "./BottomDialog";
import type { ClaimableAsset } from "@/types/index.d.ts";
import ClaimableStakesList from "@/components/ClaimableStakesList";
import { Dialog } from "@/components/Dialog";
import { PrimaryButton } from "@/components/Button";
import ReleaseCalculatorContent from "@/components/ReleaseCalculatorContent";
import { Tabs } from "@/components/Tabs";
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
          title={
            <span className="inline-flex items-center gap-2">
              <img
                src={asset?.["asset_icon"]}
                alt={assetName}
                className="size-6 rounded-full"
              />
              {assetName}
            </span>
          }
          description={"View stakes and release calculator"}
        >
          {/* Tabs */}
          <Tabs.Root defaultValue="stakes" className="flex flex-col gap-3">
            <Tabs.List>
              {["stakes", "calculator"].map((value) => (
                <Tabs.Trigger key={value} value={value}>
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
