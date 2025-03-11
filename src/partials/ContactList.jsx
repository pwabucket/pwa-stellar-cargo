import useAppStore from "@/store/useAppStore";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { Link } from "react-router";
import { Reorder, useDragControls } from "motion/react";
import { cn, truncatePublicKey } from "@/lib/utils";
import { memo } from "react";

const ContactReorderItem = memo(({ children, ...props }) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Item {...props} dragListener={false} dragControls={dragControls}>
      <div className="flex gap-2">
        <div className="min-w-0 min-h-0 grow">{children}</div>
        <button
          className={cn(
            "bg-neutral-100 dark:bg-neutral-800",
            "flex items-center justify-center",
            "px-3 rounded-xl shrink-0",
            "touch-none"
          )}
          onPointerDown={(event) => dragControls.start(event)}
        >
          <HiOutlineSquares2X2 className="w-4 h-4" />
        </button>
      </div>
    </Reorder.Item>
  );
});

export default function ContactList() {
  const contacts = useAppStore((state) => state.contacts);
  const setContacts = useAppStore((state) => state.setContacts);

  return contacts.length >= 1 ? (
    <Reorder.Group
      values={contacts}
      onReorder={(newOrder) => setContacts(newOrder)}
      className="flex flex-col gap-2"
    >
      {contacts.map((contact) => (
        <ContactReorderItem key={contact.id} value={contact}>
          <Link
            to={`/contacts/${contact.id}`}
            className={cn(
              "group rounded-xl px-3",
              "bg-neutral-100 dark:bg-neutral-800",
              "hover:bg-blue-500 hover:text-white",
              "flex items-center gap-2"
            )}
          >
            <h4 className="font-bold truncate grow min-w-0 py-2">
              {contact.name || "Stellar Contact"}
            </h4>
            <div className="flex flex-col min-w-0 shrink-0">
              <p
                className={cn(
                  "truncate",
                  "text-xs text-blue-500",
                  "group-hover:text-blue-100"
                )}
              >
                {truncatePublicKey(contact.address)}
              </p>
              {contact.memo ? (
                <p className="text-xs">({contact.memo})</p>
              ) : null}
            </div>
          </Link>
        </ContactReorderItem>
      ))}
    </Reorder.Group>
  ) : (
    <p className="text-center">No contact to display</p>
  );
}
