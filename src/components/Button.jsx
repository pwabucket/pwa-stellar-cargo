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
        "flex items-center justify-center gap-2",
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
      className={cn(
        "bg-blue-600 text-white hover:bg-blue-700",
        props.className
      )}
    />
  );
});

export const SecondaryButton = memo(function (props) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-slate-700 text-white border border-slate-600 hover:bg-slate-600",
        props.className
      )}
    />
  );
});
