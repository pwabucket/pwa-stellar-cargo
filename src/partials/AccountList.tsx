import { useMemo, useState } from "react";

import type { Account as AccountData } from "@/types/index.d.ts";
import AccountItem from "@/components/AccountItem";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import { Reorder } from "motion/react";
import ReorderItem from "@/components/ReorderItem";
import { searchProperties } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

const AccountReorderItem = ReorderItem;

const Account = ({ account }: { account: AccountData }) => (
  <AccountItem
    as={Link}
    account={account}
    to={`/accounts/${account.publicKey}`}
  />
);

export default function AccountList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const accounts = useMemo(
    () =>
      search ? searchProperties(list, search, ["name", "publicKey"]) : list,
    [list, search],
  );
  const hideHandle = Boolean(search);

  return (
    <>
      {/* Search */}
      <Input
        value={search}
        type="search"
        placeholder="Search"
        className="mt-1"
        onChange={(ev) => setSearch(ev.target.value)}
      />
      {accounts.length > 0 ? (
        <Reorder.Group
          values={accounts}
          onReorder={(newOrder) => setAccounts(newOrder)}
          className="flex flex-col"
        >
          {accounts.map((account) => (
            <AccountReorderItem
              key={account.keyId}
              value={account}
              hideHandle={hideHandle}
            >
              <Account account={account} />
            </AccountReorderItem>
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-center">No account to display</p>
      )}
    </>
  );
}
