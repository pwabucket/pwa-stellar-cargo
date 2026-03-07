import Toggle from "./Toggle";
import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function LabelToggle({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <label
      className={cn(
        "border border-neutral-600",
        "flex items-center gap-4 px-3 py-2 cursor-pointer rounded-full",
        "has-[input:disabled]:opacity-60",
      )}
    >
      <h4 className="min-w-0 min-h-0 grow">{children}</h4> <Toggle {...props} />
    </label>
  );
});
