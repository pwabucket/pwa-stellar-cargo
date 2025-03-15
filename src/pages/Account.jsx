import AccountAsset from "@/components/AccountAsset";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { Link, NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useOutletContext } from "react-router";

const PageNavLink = (props) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      cn(
        "text-center uppercase",
        isActive && [
          "font-bold text-blue-500",
          "bg-neutral-100 dark:bg-neutral-800",
          "rounded-full px-3 py-1",
        ]
      )
    }
  />
);

export default function Account() {
  const { balances } = useOutletContext();

  return (
    <div className="flex flex-col gap-2">
      {balances.map((balance, index) => (
        <AccountAsset
          key={index}
          as={Link}
          to={`assets/${balance["asset_id"]}`}
          asset={balance}
        />
      ))}

      {/* Add Trustline */}
      <div className="flex p-2 justify-center">
        <Link
          to={"trustlines/add"}
          className="text-blue-500 flex items-center gap-2"
        >
          <HiOutlinePlusCircle className="size-4" />
          Add Trustline
        </Link>
      </div>
    </div>
  );
}
