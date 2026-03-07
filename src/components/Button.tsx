import type { DynamicComponent } from "@/types/component";
import { cn } from "@/lib/utils";
import { memo } from "react";

export const Button = memo(function ({ as: Component = "button", ...props }) {
  return (
    <Component
      {...props}
      className={cn(
        "font-bold px-4 py-2 rounded-xl",
        "flex items-center justify-center gap-2",
        "disabled:opacity-60",
        props.className,
      )}
    />
  );
}) as DynamicComponent<"button">;

export const PrimaryButton = memo(function (props) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-blue-400 text-black hover:bg-blue-300",
        props.className,
      )}
    />
  );
}) as DynamicComponent<"button">;

export const SecondaryButton = memo(function (props) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-neutral-900 text-white hover:bg-neutral-800",
        props.className,
      )}
    />
  );
}) as DynamicComponent<"button">;
