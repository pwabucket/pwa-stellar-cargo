import { cn } from "@/lib/utils";
import { memo } from "react";

export const Button = memo(function ({
  as: Component = "button", // eslint-disable-line no-unused-vars
  ...props
}) {
  return (
    <Component
      {...props}
      className={cn(
        "font-bold px-4 py-2 rounded-full",
        "disabled:opacity-60",
        props.className
      )}
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
