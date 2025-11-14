import AccountAsset from "@/components/AccountAsset";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

export default function AssetPicker({ assets, onSelect }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <Dialog.Content
        className={cn(
          "bg-black",
          "fixed z-50 inset-x-0 bottom-0 rounded-t-2xl",
          "h-3/4 overflow-auto",
          "flex flex-col"
        )}
        onOpenAutoFocus={(ev) => ev.preventDefault()}
      >
        <div
          className={cn("w-full max-w-md mx-auto p-4", "flex flex-col gap-2")}
        >
          {/* Title and Description */}
          <div className="flex flex-col">
            <Dialog.Title className="text-center text-xl font-bold text-blue-300">
              Asset Picker
            </Dialog.Title>
            <Dialog.Description className="text-center text-sm text-neutral-400">
              Choose an asset
            </Dialog.Description>
          </div>

          <div className="flex flex-col divide-y divide-neutral-950">
            {assets.map((asset) => (
              <AccountAsset
                as={Dialog.Close}
                asset={asset}
                key={asset["transaction_name"]}
                onClick={() => onSelect(asset)}
                className="text-left"
              />
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
