import { Transition, TransitionChild } from "@headlessui/react";

import { Dialog as DialogPrimitive } from "radix-ui";
import { forwardRef } from "react";

interface DialogPortalProps {
  open: boolean;
  children?: React.ReactNode;
}

const DialogRoot = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props} />
);

const DialogPortal = (props: DialogPortalProps) => (
  <DialogPrimitive.Portal forceMount>
    <Transition appear show={props.open} as="div">
      {props.children}
    </Transition>
  </DialogPrimitive.Portal>
);

const DialogOverlay = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Overlay} />
));

const DialogContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Content} />
));

const Dialog = Object.assign(DialogRoot, {
  ...DialogPrimitive,
  Root: DialogRoot,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
});

export { Dialog };
export type { DialogPrimitive };
