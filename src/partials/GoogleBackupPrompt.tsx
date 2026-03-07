import { HiOutlineArrowPath, HiOutlineXMark } from "react-icons/hi2";
import { PrimaryButton, SecondaryButton } from "@/components/Button";

import Alert from "@/components/Alert";
import AppIcon from "@/assets/images/icon.svg";
import type { BackupFile } from "@/types/index.d.ts";
import { Dialog } from "@/components/Dialog";
import { FaGoogleDrive } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

interface GoogleBackupPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolve: (value: boolean) => void;
  backupFile: BackupFile | null;
}

export default function GoogleBackupPrompt({
  open,
  onOpenChange,
  resolve,
  backupFile,
}: GoogleBackupPromptProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal open={open}>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0",
            "flex items-center justify-center",
            "p-4 overflow-auto",
            "z-100 bg-black/50",
          )}
        >
          <Dialog.Content
            className={cn(
              "flex flex-col",
              "w-full max-w-sm gap-2 p-4 rounded-xl",
              "bg-neutral-950",
            )}
          >
            {/* Title */}
            <Dialog.Title
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "font-bold text-center",
                "text-blue-400",
              )}
            >
              <img src={AppIcon} className="w-8" />
              {import.meta.env.VITE_APP_NAME}
            </Dialog.Title>

            {/* Description */}
            <Dialog.Description
              className={cn(
                "px-2 text-center text-neutral-400",
                "flex items-center justify-center gap-2",
              )}
            >
              <FaGoogleDrive /> Google Drive Backup
            </Dialog.Description>
            {backupFile ? (
              <Alert variant={"success"} className="text-sm">
                {formatDate(new Date(backupFile.modifiedTime), "PPPPpppp")}
              </Alert>
            ) : null}

            {/* Restore Button */}
            <Dialog.Close onClick={() => resolve(true)} asChild>
              <PrimaryButton>
                <HiOutlineArrowPath className="size-5" />
                Restore
              </PrimaryButton>
            </Dialog.Close>

            {/* Cancel Button */}
            <Dialog.Close onClick={() => resolve(false)} asChild>
              <SecondaryButton>
                <HiOutlineXMark className="size-5" />
                Cancel
              </SecondaryButton>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
