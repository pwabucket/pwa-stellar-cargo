import { cn, truncatePublicKey } from "@/lib/utils";

import AccountImage from "./AccountImage";

export default function ContactItem({ as, contact, ...props }) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      className={cn(
        "text-left",
        "group p-2 bg-black",
        "flex gap-3 items-center",
        props.className
      )}
    >
      <AccountImage
        publicKey={contact.address}
        className="size-7 rounded-full"
      />
      <div className="grow min-w-0">
        <h4 className="font-bold truncate group-hover:text-blue-200">
          {contact.name || "Stellar Contact"}
        </h4>
      </div>
      <div className="flex flex-col text-right min-w-0 shrink-0">
        <p
          className={cn(
            "truncate",
            "text-xs text-neutral-400",
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
