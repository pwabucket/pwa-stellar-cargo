import AccountAsset from "@/components/AccountAsset";
import { BottomDialog } from "@/components/BottomDialog";
import { Dialog } from "@/components/Dialog";
import type { EnrichedBalance } from "@/types/index.d.ts";

interface AssetPickerProps {
  open: boolean;
  assets: EnrichedBalance[];
  onSelect: (asset: EnrichedBalance) => void;
}

export default function AssetPicker({
  open,
  assets,
  onSelect,
}: AssetPickerProps) {
  return (
    <Dialog.Portal open={open}>
      <BottomDialog
        title="Asset Picker"
        description="Choose an asset"
        onOpenAutoFocus={(ev) => ev.preventDefault()}
      >
        <div className="flex flex-col gap-1.5">
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
      </BottomDialog>
    </Dialog.Portal>
  );
}
