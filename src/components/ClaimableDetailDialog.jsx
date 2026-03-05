import { Dialog, Tabs } from "radix-ui";

import ClaimableStakesList from "@/components/ClaimableStakesList";
import { PrimaryButton } from "@/components/Button";
import ReleaseCalculatorContent from "@/components/ReleaseCalculatorContent";
import { cn } from "@/lib/utils";
import useClaimableStakes from "@/hooks/useClaimableStakes";

export default function ClaimableDetailDialog({
  asset,
  open,
  onOpenChange,
  children,
}) {
  const assetName =
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"];

  const stakes = useClaimableStakes(asset);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content
          className={cn(
            "bg-slate-800",
            "fixed z-50 inset-x-0 bottom-0 rounded-t-2xl",
            "h-3/4 overflow-auto",
            "flex flex-col",
          )}
          onOpenAutoFocus={(ev) => ev.preventDefault()}
        >
          <div
            className={cn("w-full max-w-md mx-auto p-4", "flex flex-col gap-3")}
          >
            {/* Header */}
            <Dialog.Title className="text-center font-bold text-blue-500">
              {assetName} Claimable
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              View stakes and release calculator for {assetName}
            </Dialog.Description>

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
                <ReleaseCalculatorContent
                  stakes={stakes}
                  assetName={assetName}
                />
              </Tabs.Content>
            </Tabs.Root>

            <Dialog.Close asChild>
              <PrimaryButton className="mt-1">Close</PrimaryButton>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
