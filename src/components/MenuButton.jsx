import { cn } from "@/lib/utils";
import { memo } from "react";

import Toggle from "./Toggle";

export const MenuButton = memo(function MenuButton({
  as: Component = "button", // eslint-disable-line no-unused-vars
  icon: Icon, // eslint-disable-line no-unused-vars
  title = "",
  children,
  ...props
}) {
  return (
    <Component
      {...props}
      title={title}
      className={cn(
        "cursor-pointer",
        "group px-3 py-2",
        "hover:text-blue-200",
        "flex items-center gap-2",
        props.className
      )}
    >
      <Icon className="size-5" />
      <div className="grow min-w-0 min-h-0 text-left">
        {title ? <h4 className="font-bold truncate">{title}</h4> : children}
      </div>
    </Component>
  );
});

export const MenuToggleButton = memo(function MenuToggleButton({
  title,
  icon,
  ...props
}) {
  return (
    <MenuButton as="label" icon={icon}>
      <div className="flex gap-2 items-center">
        <h4 className="grow min-w-0 min-h-0 font-bold truncate">{title}</h4>
        <Toggle {...props} />
      </div>
    </MenuButton>
  );
});
