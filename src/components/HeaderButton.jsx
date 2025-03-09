import cn from "@/lib/utils";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { useNavigate } from "react-router";

export function HeaderButton({
  as: Component = "button",
  icon: Icon,
  ...props
}) {
  return (
    <Component
      {...props}
      className={cn(
        "size-10 rounded-full",
        "flex justify-center items-center",
        "hover:bg-neutral-100",
        props.className
      )}
    >
      <Icon className="size-6" />
    </Component>
  );
}

export function HeaderReturnButton(props) {
  const navigate = useNavigate();

  return (
    <HeaderButton
      {...props}
      onClick={() => navigate(-1)}
      icon={HiOutlineArrowLeft}
    />
  );
}
