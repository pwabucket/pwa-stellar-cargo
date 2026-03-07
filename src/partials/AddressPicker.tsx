import { cn, searchProperties } from "@/lib/utils";
import { useMemo, useState } from "react";

import { AccountElement } from "@/components/AccountElement";
import { BottomDialog } from "@/components/BottomDialog";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { Tabs } from "radix-ui";
import useAppStore from "@/store/useAppStore";

interface AddressPickerProps {
  open: boolean;
  publicKey: string;
  onSelect: (data: { address: string; memo: string }) => void;
}

export default function AddressPicker({
  open,
  publicKey,
  onSelect,
}: AddressPickerProps) {
  const [accountSearch, setAccountSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const allAccountsList = useAppStore((state) => state.accounts);
  const contactsList = useAppStore((state) => state.contacts);

  const accountsList = useMemo(
    () => allAccountsList.filter((item) => item.publicKey !== publicKey),
    [allAccountsList, publicKey],
  );

  const accounts = useMemo(
    () =>
      accountSearch
        ? searchProperties(accountsList, accountSearch, ["name", "publicKey"])
        : accountsList,
    [accountsList, accountSearch],
  );

  const contacts = useMemo(
    () =>
      contactSearch
        ? searchProperties(contactsList, contactSearch, ["name", "address"])
        : contactsList,
    [contactsList, contactSearch],
  );

  return (
    <Dialog.Portal open={open}>
      <BottomDialog
        title="Address Picker"
        description="Choose an account or contact"
      >
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
                  "data-[state=active]:border-blue-500",
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
            <div className="flex flex-col gap-2">
              {accounts.map((account) => (
                <AccountElement.Root
                  key={account.publicKey}
                  as={Dialog.Close}
                  onClick={() =>
                    onSelect({
                      address: account.publicKey,
                      memo: "",
                    })
                  }
                >
                  {/* Account Image */}
                  <AccountElement.Image publicKey={account.publicKey} />

                  {/* Account Details */}
                  <AccountElement.Details
                    name={account.name || "Stellar Account"}
                    publicKey={account.publicKey}
                  />
                </AccountElement.Root>
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
            <div className="flex flex-col gap-2">
              {contacts.map((contact) => (
                <AccountElement.Root
                  as={Dialog.Close}
                  key={contact.id}
                  onClick={() =>
                    onSelect({
                      address: contact.address,
                      memo: contact.memo,
                    })
                  }
                >
                  {/* Contact Image */}
                  <AccountElement.Image publicKey={contact.address} />

                  {/* Contact Details */}
                  <AccountElement.Details
                    name={contact.name || "Stellar Contact"}
                    publicKey={contact.address}
                    memo={contact.memo}
                  />
                </AccountElement.Root>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </BottomDialog>
    </Dialog.Portal>
  );
}
