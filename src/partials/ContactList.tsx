import { Reorder, useDragControls } from "motion/react";
import { useMemo, useState } from "react";

import { AccountElement } from "@/components/AccountElement";
import type { Contact } from "@/types";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import { searchProperties } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

const ContactReorderItem = ({ contact }: { contact: Contact }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={contact}
      dragListener={false}
      dragControls={dragControls}
    >
      <AccountElement.Root>
        {/* Contact Image */}
        <AccountElement.Image
          publicKey={contact.address}
          onPointerDown={(event) => dragControls.start(event)}
        />

        {/* Contact Details */}
        <AccountElement.Details
          as={Link}
          to={`/contacts/${contact.id}`}
          name={contact.name || "Stellar Contact"}
          publicKey={contact.address}
          memo={contact.memo}
        />
      </AccountElement.Root>
    </Reorder.Item>
  );
};

export default function ContactList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.contacts);
  const setContacts = useAppStore((state) => state.setContacts);

  const contacts = useMemo(
    () => (search ? searchProperties(list, search, ["name", "address"]) : list),
    [list, search],
  );
  const hasSearch = Boolean(search);

  return (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <Input
        value={search}
        type="search"
        name="contact-search"
        placeholder="Search"
        onChange={(ev) => setSearch(ev.target.value)}
      />
      {contacts.length > 0 ? (
        <Reorder.Group
          values={contacts}
          onReorder={(newOrder) => !hasSearch && setContacts(newOrder)}
          className="flex flex-col gap-2"
        >
          {contacts.map((contact) => (
            <ContactReorderItem key={contact.id} contact={contact} />
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-center">No contact to display</p>
      )}
    </div>
  );
}
