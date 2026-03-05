import { Transition, TransitionChild } from "@headlessui/react";

import { Dialog as DialogPrimitive } from "radix-ui";
import { forwardRef } from "react";

const DialogRoot = (props) => <DialogPrimitive.Root {...props} />;

const DialogPortal = (props) => (
  <DialogPrimitive.Portal forceMount>
    <Transition appear show={props.open} as="div">
      {props.children}
    </Transition>
  </DialogPrimitive.Portal>
);

const DialogOverlay = forwardRef((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Overlay} />
));

const DialogContent = forwardRef((props, ref) => (
  <TransitionChild {...props} ref={ref} as={DialogPrimitive.Content} />
));

Object.assign(DialogRoot, {
  ...DialogPrimitive,
  Root: DialogRoot,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
});

export { DialogRoot as Dialog };
