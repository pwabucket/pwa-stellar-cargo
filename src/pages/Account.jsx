import AccountAsset from "@/components/AccountAsset";
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
          to={`assets/${
            balance["asset_type"] === "native"
              ? "XLM"
              : `${balance["asset_code"]}-${balance["asset_issuer"]}`
          }`}
          asset={balance}
          icon={balance["asset_icon"]}
          domain={balance["asset_domain"]}
        />
      ))}
    </div>
  );
}
