import { HiOutlineBars3 } from "react-icons/hi2";
import { Reorder, useDragControls } from "motion/react";
import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function ReorderItem({ children, hideHandle, ...props }) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item {...props} dragListener={false} dragControls={dragControls}>
      <div className="flex items-center">
        <div className="min-w-0 min-h-0 grow">{children}</div>
        <button
          className={cn(
            "hover:bg-neutral-950",
            "flex items-center justify-center",
            "p-3 rounded-full shrink-0",
            "touch-none",
            hideHandle && "hidden"
          )}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <HiOutlineBars3 className="size-4" />
        </button>
      </div>
    </Reorder.Item>
  );
});
