import { cn } from "@/lib/utils";
import { Dialog, type DialogPrimitive } from "./Dialog";

interface BottomDialogProps extends DialogPrimitive.DialogContentProps {
  title: string;
  description?: string;
}

export const BottomDialog = ({
  title,
  description,
  ...props
}: BottomDialogProps) => (
  <>
    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 transition duration-300 data-closed:opacity-0" />
    <Dialog.Content
      {...props}
      className={cn(
        "bg-neutral-950 transition duration-300 data-closed:translate-y-full",
        "fixed z-50 inset-x-0 bottom-0 rounded-t-2xl",
        "h-3/4 max-h-3/4 overflow-auto",
        "flex flex-col",
        props.className,
      )}
    >
      <div className={cn("w-full max-w-md mx-auto p-4", "flex flex-col gap-2")}>
        {/* Title and Description */}
        <div className="flex flex-col">
          <Dialog.Title className="text-center text-xl font-light text-blue-300">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-center text-sm text-neutral-400">
              {description}
            </Dialog.Description>
          )}
        </div>

        {/* Children */}
        {props.children}
      </div>
    </Dialog.Content>
  </>
);
