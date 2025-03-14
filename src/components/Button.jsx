import { cn } from "@/lib/utils";
import { memo } from "react";

export const Button = memo(function ({ as: Component = "button", ...props }) {
  return (
    <Component
      {...props}
      className={cn("p-2 rounded-xl", "disabled:opacity-60", props.className)}
    />
  );
});

export const PrimaryButton = memo(function (props) {
  return (
    <Button
      {...props}
      className={cn("bg-blue-500 text-white", props.className)}
    />
  );
});

export const SecondaryButton = memo(function (props) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-black text-white",
        "dark:bg-white dark:text-black",
        props.className
      )}
    />
  );
});
