import Alert from "@/components/Alert";
import AppIcon from "@/assets/images/icon.svg";
import { Dialog } from "radix-ui";
import { FaGoogleDrive } from "react-icons/fa";
import { HiOutlineArrowPath, HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

export default function GoogleBackupPrompt({
  open,
  onOpenChange,
  resolve,
  backupFile,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0",
            "flex items-center justify-center",
            "p-4 overflow-auto",
            "z-40 bg-black/50"
          )}
        >
          <Dialog.Content
            className={cn(
              "flex flex-col",
              "w-full max-w-sm gap-2 p-4 rounded-xl",
              "border border-neutral-800",
              "bg-black"
            )}
          >
            {/* Title */}
            <Dialog.Title
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "font-bold text-center",
                "text-blue-500"
              )}
            >
              <img src={AppIcon} className="w-8" />
              {import.meta.env.VITE_APP_NAME}
            </Dialog.Title>

            {/* Description */}
            <Dialog.Description
              className={cn(
                "px-2 text-center text-neutral-300",
                "flex items-center justify-center gap-2"
              )}
            >
              <FaGoogleDrive /> Google Drive Backup
            </Dialog.Description>

            <Alert variant={"success"} className="text-sm">
              {formatDate(
                new Date(backupFile?.modifiedTime || null),
                "PPPPpppp"
              )}
            </Alert>

            {/* Restore Button */}
            <Dialog.Close
              onClick={() => resolve(true)}
              className={cn(
                "px-4 py-2 bg-blue-600 text-white rounded-full",
                "flex items-center justify-center gap-2"
              )}
            >
              <HiOutlineArrowPath className="size-5" />
              Restore
            </Dialog.Close>

            {/* Cancel Button */}
            <Dialog.Close
              onClick={() => resolve(false)}
              className={cn(
                "px-4 py-2 border border-neutral-800 rounded-full",
                "flex items-center justify-center gap-2"
              )}
            >
              <HiOutlineXMark className="size-5" />
              Cancel
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
