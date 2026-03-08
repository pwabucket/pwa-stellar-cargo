import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

import type { DynamicComponent } from "@/types/component";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useState } from "react";

export const Input = memo(function ({ as: Component = "input", ...props }) {
  return (
    <Component
      {...props}
      className={cn(
        "w-full",
        "bg-neutral-900",
        "px-3 py-2 rounded-xl",
        "outline-0",
        "read-only:opacity-60",
        "disabled:opacity-60",
        "focus:ring-2 focus:ring-blue-400",

        /* Autofill Styles - Source - https://stackoverflow.com/a/14205976*/
        "autofill:bg-clip-text",
        "autofill:inset-ring-30",
        "autofill:inset-ring-neutral-900",
        "autofill:caret-white",
        "autofill:[-webkit-text-fill-color:var(--color-white)]",
        props.className,
      )}
    />
  );
}) as DynamicComponent<"input">;

export const PasswordInput = memo(function (props) {
  const [show, setShow] = useState(false);
  const ButtonIcon = show ? HiOutlineEye : HiOutlineEyeSlash;

  return (
    <div className="relative">
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={cn("pr-10 w-full", props.className)}
      />
      <button
        disabled={props.disabled}
        onClick={() => setShow((prev) => !prev)}
        type="button"
        className={cn(
          "absolute inset-y-0 right-0",
          "w-10 outline-0",
          "flex items-center justify-center",
          "hover:bg-neutral-800",
          "rounded-r-xl disabled:opacity-60",
        )}
      >
        <ButtonIcon className="size-6" />
      </button>
    </div>
  );
}) as DynamicComponent<"input">;
