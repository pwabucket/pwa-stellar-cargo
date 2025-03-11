import * as Dialog from "@radix-ui/react-dialog";
import useAppStore from "@/store/useAppStore";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useMemo } from "react";

export default function AddressPicker({ publicKey, onSelect }) {
  const list = useAppStore((state) => state.accounts);
  const otherAccounts = useMemo(
    () => list.filter((item) => item.publicKey !== publicKey),
    [list, publicKey]
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
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
              Address Picker
            </Dialog.Title>
            <Dialog.Description className="text-center text-neutral-500 dark:text-neutral-400">
              Choose an address
            </Dialog.Description>
          </div>

          {/* List */}
          <div className="flex flex-col gap-2">
            {otherAccounts.map((account) => (
              <Dialog.Close
                className={cn(
                  "text-left",
                  "group rounded-xl px-3 py-2",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "hover:bg-blue-500 hover:text-white",
                  "flex items-center gap-2"
                )}
                onClick={() =>
                  onSelect({
                    address: account.publicKey,
                    memo: "",
                  })
                }
              >
                <h4 className="font-bold truncate grow min-w-0">
                  {account.name || "Stellar Account"}
                </h4>
                <p
                  className={cn(
                    "truncate",
                    "text-sm text-blue-500",
                    "group-hover:text-blue-100"
                  )}
                >
                  {truncatePublicKey(account.publicKey)}
                </p>
              </Dialog.Close>
            ))}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
