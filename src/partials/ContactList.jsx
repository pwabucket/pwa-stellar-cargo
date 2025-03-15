import ReorderItem from "@/components/ReorderItem";
import useAppStore from "@/store/useAppStore";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import { Reorder } from "motion/react";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useMemo, useState } from "react";

const ContactReorderItem = ReorderItem;

export default function ContactList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.contacts);
  const setContacts = useAppStore((state) => state.setContacts);

  const contacts = useMemo(
    () =>
      search
        ? list.filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.address.toLowerCase() === search.toLowerCase()
          )
        : list,
    [list, search]
  );
  const hideHandle = Boolean(search);

  return (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <Input
        value={search}
        type="search"
        placeholder="Search"
        className="mt-1"
        onChange={(ev) => setSearch(ev.target.value)}
      />
      {contacts.length > 0 ? (
        <Reorder.Group
          values={contacts}
          onReorder={(newOrder) => setContacts(newOrder)}
          className="flex flex-col gap-2"
        >
          {contacts.map((contact) => (
            <ContactReorderItem
              key={contact.id}
              value={contact}
              hideHandle={hideHandle}
            >
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
      )}
    </div>
  );
}
