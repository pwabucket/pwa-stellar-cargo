import { cn, truncatePublicKey } from "@/lib/utils";

import AccountImage from "./AccountImage";

export default function ContactItem({ as, contact, ...props }) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      className={cn(
        "text-left",
        "group rounded-xl px-2 py-1",
        "bg-neutral-100 dark:bg-neutral-800",
        "hover:bg-blue-500 hover:text-white",
        "flex items-center gap-2",
        props.className
      )}
    >
      <AccountImage
        publicKey={contact.address}
        className="size-8 rounded-full p-1 bg-neutral-200 dark:bg-neutral-700"
      />
      <div className="grow min-w-0">
        <h4 className="font-bold truncate grow min-w-0">
          {contact.name || "Stellar Contact"}
        </h4>
      </div>
      <div className="flex flex-col text-right min-w-0 shrink-0">
        <p
          className={cn(
            "truncate",
            "text-xs text-neutral-500 dark:text-neutral-400",
            "group-hover:text-blue-200"
          )}
        >
          {truncatePublicKey(contact.address)}
        </p>
        {contact.memo ? <p className="text-xs">({contact.memo})</p> : null}
      </div>
    </Component>
  );
}
