import type { DynamicComponent, DynamicComponentProps } from "@/types";

import { HiOutlineArrowLeft } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import useNavigateBack from "@/hooks/useNavigateBack";

interface HeaderButtonProps {
  icon: React.ComponentType<{ className?: string }>;
}

export const HeaderButton: DynamicComponent<"button", HeaderButtonProps> = ({
  as: Component = "button",
  icon: Icon,
  ...props
}) => {
  return (
    <Component
      {...props}
      className={cn(
        "size-10 rounded-full",
        "flex justify-center items-center",
        "hover:bg-slate-700",
        props.className,
      )}
    >
      <Icon className="size-6" />
    </Component>
  );
};

export const HeaderReturnButton = ((props: DynamicComponentProps<"button">) => {
  const navigateBack = useNavigateBack();

  return (
    <HeaderButton
      {...props}
      onClick={() => navigateBack()}
      icon={HiOutlineArrowLeft}
    />
  );
}) as DynamicComponent<"button">;
