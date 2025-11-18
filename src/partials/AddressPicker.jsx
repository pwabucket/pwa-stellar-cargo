import AccountItem from "@/components/AccountItem";
import ContactItem from "@/components/ContactItem";
import useAppStore from "@/store/useAppStore";
import { Dialog, Tabs } from "radix-ui";
import { Input } from "@/components/Input";
import { cn, searchProperties } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function AddressPicker({ publicKey, onSelect }) {
  const [accountSearch, setAccountSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const allAccountsList = useAppStore((state) => state.accounts);
  const contactsList = useAppStore((state) => state.contacts);

  const accountsList = useMemo(
    () => allAccountsList.filter((item) => item.publicKey !== publicKey),
    [allAccountsList, publicKey]
  );

  const accounts = useMemo(
    () =>
      accountSearch
        ? searchProperties(accountsList, accountSearch, ["name", "publicKey"])
        : accountsList,
    [accountsList, accountSearch]
  );

  const contacts = useMemo(
    () =>
      contactSearch
        ? searchProperties(contactsList, contactSearch, ["name", "address"])
        : contactsList,
    [contactsList, contactSearch]
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <Dialog.Content
        className={cn(
          "bg-black",
          "fixed z-50 inset-x-0 bottom-0 rounded-t-2xl",
          "h-3/4 overflow-auto",
          "flex flex-col"
        )}
        onOpenAutoFocus={(ev) => ev.preventDefault()}
      >
        <div
          className={cn("w-full max-w-md mx-auto p-4", "flex flex-col gap-2")}
        >
          {/* Title and Description */}
          <div className="flex flex-col gap-1">
            <Dialog.Title className="text-center font-bold text-blue-500">
              Address Picker
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Choose an account or contact
            </Dialog.Description>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue="accounts" className="flex flex-col gap-4">
            <Tabs.List className="grid grid-cols-2">
              {["accounts", "contacts"].map((value, index) => (
                <Tabs.Trigger
                  key={index}
                  value={value}
                  className={cn(
                    "p-2",
                    "border-b-2 border-transparent",
                    "capitalize",
                    "data-[state=active]:border-blue-500"
                  )}
                >
                  {value}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Accounts */}
            <Tabs.Content value="accounts" className="flex flex-col gap-4">
              {/* Account Search */}
              <Input
                value={accountSearch}
                type="search"
                placeholder="Search"
                onChange={(ev) => setAccountSearch(ev.target.value)}
              />
              <div className="flex flex-col divide-y divide-neutral-800">
                {accounts.map((account) => (
                  <AccountItem
                    key={account.publicKey}
                    as={Dialog.Close}
                    account={account}
                    onClick={() =>
                      onSelect({
                        address: account.publicKey,
                        memo: "",
                      })
                    }
                  />
                ))}
              </div>
            </Tabs.Content>

            {/* Contacts */}
            <Tabs.Content value="contacts" className="flex flex-col gap-4">
              {/* Contact Search */}
              <Input
                type="search"
                placeholder="Search"
                value={contactSearch}
                onChange={(ev) => setContactSearch(ev.target.value)}
              />
              <div className="flex flex-col divide-y divide-neutral-800">
                {contacts.map((contact) => (
                  <ContactItem
                    as={Dialog.Close}
                    key={contact.id}
                    contact={contact}
                    onClick={() =>
                      onSelect({
                        address: contact.address,
                        memo: contact.memo,
                      })
                    }
                  />
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
