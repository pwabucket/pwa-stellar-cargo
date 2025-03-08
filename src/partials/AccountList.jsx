import cn from "@/lib/utils";
import useAppStore from "@/store/useAppStore";
import { Link } from "react-router";

export default function AccountList() {
  const accounts = useAppStore((state) => state.accounts);

  return (
    <div className="flex flex-col gap-1">
      {accounts.length >= 1 ? (
        accounts.map((account) => (
          <Link
            to={`/account/${account.publicKey}`}
            key={account.keyId}
            className={cn(
              "group rounded-xl px-3 py-2",
              "bg-neutral-100",
              "hover:bg-blue-500 hover:text-white"
            )}
          >
            <h4 className="font-bold truncate">
              {account.name || "Stellar Account"}
            </h4>
            <p
              className={cn(
                "truncate",
                "text-xs text-blue-500",
                "group-hover:text-blue-100"
              )}
            >
              {account.publicKey}
            </p>
          </Link>
        ))
      ) : (
        <p className="text-center">No account to display</p>
      )}
    </div>
  );
}
