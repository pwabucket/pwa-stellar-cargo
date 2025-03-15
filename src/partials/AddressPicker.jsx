import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import useAppStore from "@/store/useAppStore";
import { Input } from "@/components/Input";
import { cn, truncatePublicKey } from "@/lib/utils";
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
        ? accountsList.filter(
            (item) =>
              item.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
              item.publicKey.toLowerCase() === accountSearch.toLowerCase()
          )
        : accountsList,
    [accountsList, accountSearch]
  );

  const contacts = useMemo(
    () =>
      contactSearch
        ? contactsList.filter(
            (item) =>
              item.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
              item.address.toLowerCase() === contactSearch.toLowerCase()
          )
        : contactsList,
    [contactsList, contactSearch]
  );

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 dark:bg-neutral-900/90" />
      <Dialog.Content
        className={cn(
          "bg-white dark:bg-black",
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
            <Tabs.Content value="accounts">
              <div className="flex flex-col gap-2">
                {/* Account Search */}
                <Input
                  value={accountSearch}
                  type="search"
                  placeholder="Search"
                  onChange={(ev) => setAccountSearch(ev.target.value)}
                />
                {accounts.map((account) => (
                  <Dialog.Close
                    key={account.publicKey}
                    className={cn(
                      "text-left",
                      "group rounded-xl px-3 py-2",
                      "bg-neutral-100 dark:bg-neutral-800",
                      "hover:bg-blue-500 hover:text-white",
                      "flex items-center gap-2"
                    )}
                    onClick={() =>
                      onSelect({
                        address: account.publicKey,
                        memo: "",
                      })
                    }
                  >
                    <h4 className="font-bold truncate grow min-w-0">
                      {account.name || "Stellar Account"}
                    </h4>
                    <p
                      className={cn(
                        "truncate",
                        "text-sm text-blue-500",
                        "group-hover:text-blue-100"
                      )}
                    >
                      {truncatePublicKey(account.publicKey)}
                    </p>
                  </Dialog.Close>
                ))}
              </div>
            </Tabs.Content>

            {/* Contacts */}
            <Tabs.Content value="contacts">
              <div className="flex flex-col gap-2">
                {/* Contact Search */}
                <Input
                  type="search"
                  placeholder="Search"
                  value={contactSearch}
                  onChange={(ev) => setContactSearch(ev.target.value)}
                />

                {contacts.map((contact) => (
                  <Dialog.Close
                    key={contact.id}
                    className={cn(
                      "group rounded-xl px-3",
                      "bg-neutral-100 dark:bg-neutral-800",
                      "hover:bg-blue-500 hover:text-white",
                      "flex items-center gap-2",
                      "text-left"
                    )}
                    onClick={() =>
                      onSelect({
                        address: contact.address,
                        memo: contact.memo,
                      })
                    }
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
                  </Dialog.Close>
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
