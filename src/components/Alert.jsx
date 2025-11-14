import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const ALERT_ICONS = {
  info: HiOutlineInformationCircle,
  warning: HiOutlineExclamationTriangle,
  danger: HiOutlineXCircle,
  success: HiOutlineCheckCircle,
};
export default function Alert({
  as: Component = "div", // eslint-disable-line no-unused-vars
  variant,
  ...props
}) {
  const Icon = ALERT_ICONS[variant];
  return (
    <Component
      {...props}
      className={cn(
        "px-4 py-2 rounded-xl text-sm",
        "flex items-center gap-4",

        {
          info: ["text-blue-300 bg-blue-950/50 border border-blue-800/50"],
          warning: [
            "text-orange-300 bg-orange-950/50 border border-orange-800/50",
          ],
          danger: ["text-red-300 bg-red-950/50 border border-red-800/50"],
          success: [
            "text-green-300 bg-green-950/50 border border-green-800/50",
          ],
        }[variant],
        props.className
      )}
    >
      <Icon className={cn("shrink-0 size-6")} />
      <p className="grow min-w-0 min-h-0">{props.children}</p>
    </Component>
  );
}
