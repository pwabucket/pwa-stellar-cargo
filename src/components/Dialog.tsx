import { Transition, TransitionChild } from "@headlessui/react";

import { Dialog as DialogPrimitive } from "radix-ui";
import { forwardRef } from "react";

interface DialogPortalProps {
  open: boolean;
  children?: React.ReactNode;
}

const DialogRoot = (
  props: React.ComponentProps<typeof DialogPrimitive.Root>,
) => <DialogPrimitive.Root {...props} />;

const DialogPortal = (props: DialogPortalProps) => (
  <DialogPrimitive.Portal forceMount>
    <Transition appear show={props.open} as="div">
      {props.children}
    </Transition>
  </DialogPrimitive.Portal>
);

const DialogOverlay = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TransitionChild>
>((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Overlay} />
));

const DialogContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TransitionChild>
>((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Content} />
));

Object.assign(DialogRoot, {
  ...DialogPrimitive,
  Root: DialogRoot,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
});

const Dialog = DialogRoot as typeof DialogRoot &
  typeof DialogPrimitive & {
    Root: typeof DialogRoot;
    Portal: typeof DialogPortal;
    Overlay: typeof DialogOverlay;
    Content: typeof DialogContent;
  };

export { Dialog };
