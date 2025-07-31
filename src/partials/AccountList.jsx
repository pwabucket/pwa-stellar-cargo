import AccountImage from "@/components/AccountImage";
import ReorderItem from "@/components/ReorderItem";
import useAppStore from "@/store/useAppStore";
import { Input } from "@/components/Input";
import { Link } from "react-router";
import { Reorder } from "motion/react";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useMemo, useState } from "react";

const AccountReorderItem = ReorderItem;

const Account = ({ account }) => (
  <Link
    to={`/accounts/${account.publicKey}`}
    className={cn(
      "group rounded-xl px-2 py-1",
      "bg-neutral-100 dark:bg-neutral-800",
      "hover:bg-blue-500 hover:text-white",
      "flex gap-2 items-center"
    )}
  >
    <AccountImage
      publicKey={account.publicKey}
      className="size-8 rounded-full"
    />
    <div className="grow min-w-0">
      <h4 className="font-bold truncate grow min-w-0 text-sm">
        {account.name || "Stellar Account"}
      </h4>
      <p
        className={cn(
          "truncate",
          "text-xs text-blue-500",
          "group-hover:text-blue-100"
        )}
      >
        {truncatePublicKey(account.publicKey, 15)}
      </p>
    </div>
  </Link>
);

export default function AccountList() {
  const [search, setSearch] = useState("");
  const list = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const accounts = useMemo(
    () =>
      search
        ? list.filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.publicKey.toLowerCase() === search.toLowerCase()
          )
        : list,
    [list, search]
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
          className="flex flex-col gap-2"
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
