import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function Toggle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <>
      <input {...props} type="checkbox" className="sr-only peer" />
      <span
        className={cn(
          "shrink-0",
          "relative rounded-full",
          "inline-flex h-6 w-11 items-center",
          "bg-neutral-800",
          "peer-checked:bg-blue-400 peer-checked:border-blue-400",

          // Before
          "peer-checked:before:translate-x-6 before:translate-x-1",
          "before:inline-block before:h-4 before:w-4",
          "before:transform before:transition",
          "before:rounded-full",
          "before:bg-white/10 peer-checked:before:bg-black",

          className,
        )}
      />
    </>
  );
});
