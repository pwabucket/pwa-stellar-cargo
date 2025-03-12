import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useState } from "react";

export const Input = memo(function ({ as: Component = "input", ...props }) {
  return (
    <Component
      {...props}
      className={cn(
        "bg-neutral-100 dark:bg-neutral-800",
        "px-3 py-2 rounded-xl",
        "outline-0",
        "read-only:opacity-60",
        "disabled:opacity-60",
        "focus:ring-2 focus:ring-blue-500",
        props.className
      )}
    />
  );
});

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
          "hover:bg-neutral-200 dark:hover:bg-neutral-700",
          "rounded-r-xl disabled:opacity-60"
        )}
      >
        <ButtonIcon className="size-6" />
      </button>
    </div>
  );
});
