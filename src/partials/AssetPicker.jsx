import AccountAsset from "@/components/AccountAsset";
import { Dialog } from "radix-ui";
import { cn } from "@/lib/utils";

export default function AssetPicker({ assets, onSelect }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 dark:bg-neutral-900/90" />
      <Dialog.Content
        className={cn(
          "bg-white dark:bg-black",
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
          <div className="flex flex-col gap-1">
            <Dialog.Title className="text-center font-bold text-blue-500">
              Asset Picker
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose an asset
            </Dialog.Description>
          </div>

          <div className="flex flex-col gap-2">
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
