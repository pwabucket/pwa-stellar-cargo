import {
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const ALERT_ICONS = {
  info: HiOutlineInformationCircle,
  warning: HiOutlineExclamationTriangle,
  danger: HiOutlineXCircle,
};
export default function Alert({ as: Component = "p", variant, ...props }) {
  const Icon = ALERT_ICONS[variant];
  return (
    <Component
      {...props}
      className={cn(
        "px-4 py-2 rounded-xl",
        "flex items-center gap-4",
        {
          info: [
            "text-blue-800 dark:text-blue-500",
            "bg-blue-50",
            "dark:bg-blue-500/20",
          ],
          warning: [
            "text-yellow-800 dark:text-yellow-500",
            "bg-yellow-50",
            "dark:bg-yellow-500/20",
          ],
          danger: [
            "text-red-800 dark:text-red-500",
            "bg-red-50",
            "dark:bg-red-500/20",
          ],
        }[variant],
        props.className
      )}
    >
      <Icon className="shrink-0 size-5" />
      <div className="grow min-w-0 min-h-0">{props.children}</div>
    </Component>
  );
}
