import ContactItem from "@/components/ContactItem";
import ReorderItem from "@/components/ReorderItem";
import useAppStore from "@/store/useAppStore";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import { Reorder } from "motion/react";
import { searchProperties } from "@/lib/utils";
import { useMemo, useState } from "react";

const ContactReorderItem = ReorderItem;

export default function ContactList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.contacts);
  const setContacts = useAppStore((state) => state.setContacts);

  const contacts = useMemo(
    () => (search ? searchProperties(list, search, ["name", "address"]) : list),
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
          className="flex flex-col divide-y divide-neutral-950"
        >
          {contacts.map((contact) => (
            <ContactReorderItem
              key={contact.id}
              value={contact}
              hideHandle={hideHandle}
            >
              <ContactItem
                as={Link}
                to={`/contacts/${contact.id}`}
                contact={contact}
              />
            </ContactReorderItem>
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-center">No contact to display</p>
      )}
    </div>
  );
}
