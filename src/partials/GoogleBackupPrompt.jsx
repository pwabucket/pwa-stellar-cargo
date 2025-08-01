import Alert from "@/components/Alert";
import AppIcon from "@/assets/images/icon.svg";
import { Dialog } from "radix-ui";
import { FaGoogleDrive } from "react-icons/fa";
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
            "z-40 bg-black/50 dark:bg-neutral-900/90"
          )}
        >
          <Dialog.Content
            className={cn(
              "flex flex-col",
              "w-full max-w-sm gap-2 p-4 rounded-xl",
              "bg-white dark:bg-neutral-900"
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
                "px-2 text-center text-neutral-500 dark:text-neutral-300",
                "flex items-center justify-center gap-2"
              )}
            >
              <FaGoogleDrive /> Google Drive Backup
            </Dialog.Description>

            <Alert variant={"warning"} className="text-sm">
              {formatDate(
                new Date(backupFile?.modifiedTime || null),
                "PPPPpppp"
              )}
            </Alert>

            {/* Restore Button */}
            <Dialog.Close
              onClick={() => resolve(true)}
              className={cn("px-4 py-2 bg-blue-500 text-white rounded-lg")}
            >
              Restore
            </Dialog.Close>

            {/* Cancel Button */}
            <Dialog.Close
              onClick={() => resolve(false)}
              className={cn(
                "px-4 py-2 bg-neutral-200 dark:bg-neutral-900 rounded-lg"
              )}
            >
              Cancel
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
