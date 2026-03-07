import { Reorder, useDragControls } from "motion/react";
import { searchProperties } from "@/lib/utils";
import { useMemo, useState } from "react";

import type { Account as AccountData } from "@/types/index.d.ts";
import { AccountElement } from "@/components/AccountElement";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import useAppStore from "@/store/useAppStore";

const Account = ({ account }: { account: AccountData }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={account}
      dragListener={false}
      dragControls={dragControls}
    >
      <AccountElement.Root>
        {/* Account Image */}
        <AccountElement.Image
          publicKey={account.publicKey}
          onPointerDown={(event) => dragControls.start(event)}
        />

        {/* Account Details */}
        <AccountElement.Details
          as={Link}
          to={`/accounts/${account.publicKey}`}
          name={account.name || "Stellar Account"}
          publicKey={account.publicKey}
        />
      </AccountElement.Root>
    </Reorder.Item>
  );
};

export default function AccountList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const accounts = useMemo(
    () =>
      search ? searchProperties(list, search, ["name", "publicKey"]) : list,
    [list, search],
  );
  const hasSearch = Boolean(search);

  return (
    <>
      {/* Search */}
      <Input
        value={search}
        name="account-search"
        type="search"
        placeholder="Search"
        className="mt-1"
        onChange={(ev) => setSearch(ev.target.value)}
      />
      {accounts.length > 0 ? (
        <Reorder.Group
          values={accounts}
          onReorder={(newOrder) => !hasSearch && setAccounts(newOrder)}
          className="flex flex-col gap-2"
        >
          {accounts.map((account) => (
            <Account key={account.keyId} account={account} />
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-center">No account to display</p>
      )}
    </>
  );
}
