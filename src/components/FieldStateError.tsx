import type { ControllerFieldState } from "react-hook-form";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface FieldStateErrorProps extends React.ComponentPropsWithoutRef<"p"> {
  fieldState: ControllerFieldState;
}

export default memo(function FieldStateError({
  fieldState,
  ...props
}: FieldStateErrorProps) {
  return fieldState.error?.message ? (
    <p {...props} className={cn("text-red-500 text-sm px-2", props.className)}>
      {fieldState.error?.message}
    </p>
  ) : null;
});
