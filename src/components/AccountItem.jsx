import { cn, truncatePublicKey } from "@/lib/utils";

import AccountImage from "./AccountImage";

export default function AccountItem({ as, account, ...props }) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      className={cn(
        "text-left",
        "group rounded-xl px-2 py-1",
        "bg-neutral-100 dark:bg-neutral-800",
        "hover:bg-blue-500 hover:text-white",
        "flex gap-2 items-center",
        props.className
      )}
    >
      <AccountImage
        publicKey={account.publicKey}
        className="size-8 rounded-full"
      />
      <div className="grow min-w-0">
        <h4 className="font-bold truncate grow min-w-0 text-sm">
          {account.name || "Stellar Account"}
        </h4>
        <p
          className={cn(
            "truncate",
            "text-xs text-neutral-500 dark:text-neutral-400",
            "group-hover:text-blue-200"
          )}
        >
          {truncatePublicKey(account.publicKey, 15)}
        </p>
      </div>
    </Component>
  );
}
