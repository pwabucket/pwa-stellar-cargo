import useAppStore from "@/store/useAppStore";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { Link } from "react-router";
import { Reorder, useDragControls } from "motion/react";
import { cn, truncatePublicKey } from "@/lib/utils";
import { memo } from "react";

const AccountReorderItem = memo(({ children, ...props }) => {
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

export default function AccountList() {
  const accounts = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);

  return accounts.length > 0 ? (
    <Reorder.Group
      values={accounts}
      onReorder={(newOrder) => setAccounts(newOrder)}
      className="flex flex-col gap-2"
    >
      {accounts.map((account) => (
        <AccountReorderItem key={account.keyId} value={account}>
          <Link
            to={`/accounts/${account.publicKey}`}
            className={cn(
              "group rounded-xl px-3 py-2",
              "bg-neutral-100 dark:bg-neutral-800",
              "hover:bg-blue-500 hover:text-white",
              "flex items-center gap-2"
            )}
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
          </Link>
        </AccountReorderItem>
      ))}
    </Reorder.Group>
  ) : (
    <p className="text-center">No account to display</p>
  );
}
