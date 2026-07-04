import type { AlertVariant, DynamicComponent } from "@/types/index.d.ts";
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

const ALERT_STYLES = {
  info: {
    panel: "text-blue-100 bg-blue-500/10 border border-blue-400/20",
    icon: "text-blue-400",
  },
  warning: {
    panel: "text-amber-100 bg-amber-500/10 border border-amber-400/20",
    icon: "text-amber-400",
  },
  danger: {
    panel: "text-red-100 bg-red-500/10 border border-red-400/20",
    icon: "text-red-400",
  },
  success: {
    panel: "text-emerald-100 bg-emerald-500/10 border border-emerald-400/20",
    icon: "text-emerald-400",
  },
};

interface AlertProps {
  variant: AlertVariant;
}

export default (function Alert({ as: Component = "div", variant, ...props }) {
  const Icon = ALERT_ICONS[variant];
  const styles = ALERT_STYLES[variant];
  return (
    <Component
      {...props}
      className={cn(
        "px-4 py-3 rounded-xl text-sm leading-relaxed",
        "flex items-center gap-3",
        styles.panel,
        props.className,
      )}
    >
      <Icon className={cn("shrink-0 size-6", styles.icon)} />
      <p className="grow min-w-0 min-h-0">{props.children}</p>
    </Component>
  );
} as DynamicComponent<"div", AlertProps>);
