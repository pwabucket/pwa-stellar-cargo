import AccountImage from "@/components/AccountImage";
import copy from "copy-to-clipboard";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useMatch } from "react-router";
import { useOutletContext } from "react-router";

const PageNavLink = ({ styleActive = true, ...props }) => (
  <NavLink
    {...props}
    end
    className={({ isActive }) =>
      cn(
        "text-center",
        isActive &&
          styleActive && [
            "font-bold text-blue-500",
            "bg-neutral-100 dark:bg-neutral-800",
            "rounded-full py-1",
          ]
      )
    }
  />
);

export default function AccountOverviewRoute() {
  const context = useOutletContext();

  const { account, totalAssetsPrice } = context;
  const assetsPage = `/accounts/${account.publicKey}`;
  const match = useMatch(assetsPage);
  const isAssetsPage = match && match.pattern.end;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 p-4 bg-blue-600 text-white rounded-2xl">
          {/* Account Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-light truncate grow min-w-0 flex gap-2 items-center">
              <AccountImage
                publicKey={account.publicKey}
                className="size-10 shrink-0 rounded-full bg-white"
              />{" "}
              {account.name || "Stellar Account"}
            </h2>

            {/* Edit Button */}
            <Link
              to={`edit`}
              className={cn(
                "shrink-0 bg-blue-500 size-9",
                "flex items-center justify-center",
                "rounded-full"
              )}
            >
              <HiOutlinePencilSquare className="size-5" />
            </Link>
          </div>

          <p className="text-3xl">
            ~${Intl.NumberFormat().format(totalAssetsPrice)}
          </p>

          {/* Address */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy(account.publicKey)}
              className="shrink-0"
            >
              <IoCopyOutline className="size-4" />
            </button>
            <h3 className="text-blue-100 truncate grow min-w-0 text-sm">
              <a
                target="_blank"
                href={`https://stellar.expert/explorer/public/account/${account.publicKey}`}
              >
                {truncatePublicKey(account.publicKey, 8)}
              </a>
            </h3>
          </div>
        </div>

        {/* NavLinks */}
        <div className="grid grid-cols-2 p-2">
          <PageNavLink
            replace
            styleActive={isAssetsPage}
            to={isAssetsPage ? assetsPage : -1}
          >
            Assets
          </PageNavLink>
          <PageNavLink to={`/accounts/${account.publicKey}/transactions`}>
            Transactions
          </PageNavLink>
        </div>

        <Outlet context={context} />
      </div>
    </>
  );
}
