import { cn } from "@/lib/utils";
import { memo } from "react";

export default memo(function MenuButton({
  as: Component = "button",
  icon: Icon,
  title = "",
  ...props
}) {
  return (
    <Component
      {...props}
      title={title}
      className={cn(
        "group rounded-xl px-3 py-2",
        "bg-neutral-100 hover:bg-neutral-200",
        "dark:bg-neutral-800 dark:hover:bg-neutral-700",
        "flex items-center gap-2",
        props.className
      )}
    >
      <Icon className="size-5" />
      <h4 className="font-bold truncate grow min-w-0 min-h-0 text-left">
        {title}
      </h4>
    </Component>
  );
});
