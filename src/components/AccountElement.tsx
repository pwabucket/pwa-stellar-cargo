import { cn, truncatePublicKey } from "@/lib/utils";

import AccountImage from "./AccountImage";
import type { DynamicComponent } from "@/types";

const AccountElementRoot = (({ as: Component = "div", ...props }) => {
  return (
    <Component
      {...props}
      className={cn(
        "bg-neutral-900",
        "group relative flex gap-2 items-center px-2 text-left",
        "rounded-xl overflow-hidden",
        "transition-all duration-200 ease-in-out",
        props.className,
      )}
    />
  );
}) as DynamicComponent<"div">;

const AccountElementImage = (
  props: React.ComponentProps<typeof AccountImage>,
) => (
  <AccountImage
    draggable={false}
    {...props}
    className={cn(
      "size-7 touch-none select-none cursor-pointer rounded-full",
      props.className,
    )}
  />
);

interface AccountElementDetailsProps {
  name: string;
  publicKey: string;
  memo?: string;
}

const AccountElementDetails = (({
  as: Component = "div",
  name,
  publicKey,
  memo,
  ...props
}) => {
  return (
    <Component
      {...props}
      className={cn("grow flex gap-2 min-w-0 items-center", props.className)}
    >
      {/* Name */}
      <h4 className="py-2 grow min-w-0 font-bold truncate group-hover:text-blue-300">
        {name}
      </h4>
      {/* Address and MEMO*/}
      <div className="flex flex-col text-right min-w-0 shrink-0">
        {/* Address */}
        <p
          className={cn(
            "truncate",
            "text-xs text-neutral-400",
            "group-hover:text-blue-200",
          )}
        >
          {truncatePublicKey(publicKey)}
        </p>
        {/* MEMO */}
        {memo ? <p className="text-xs">({memo})</p> : null}
      </div>
    </Component>
  );
}) as DynamicComponent<"div", AccountElementDetailsProps>;

const AccountElement = Object.assign(AccountElementRoot, {
  Root: AccountElementRoot,
  Image: AccountElementImage,
  Details: AccountElementDetails,
});

export { AccountElement };
