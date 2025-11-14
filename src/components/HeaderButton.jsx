import useNavigateBack from "@/hooks/useNavigateBack";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export function HeaderButton({
  as: Component = "button", // eslint-disable-line no-unused-vars
  icon: Icon, // eslint-disable-line no-unused-vars
  ...props
}) {
  return (
    <Component
      {...props}
      className={cn(
        "size-10 rounded-full",
        "flex justify-center items-center",
        "hover:bg-neutral-950",
        props.className
      )}
    >
      <Icon className="size-6" />
    </Component>
  );
}

export function HeaderReturnButton(props) {
  const navigateBack = useNavigateBack();

  return (
    <HeaderButton
      {...props}
      onClick={() => navigateBack()}
      icon={HiOutlineArrowLeft}
    />
  );
}
