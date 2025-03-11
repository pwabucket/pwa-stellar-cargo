import AccountAsset from "@/components/AccountAsset";
import AccountImage from "@/components/AccountImage";
import QueryError from "@/components/QueryError";
import Spinner from "@/components/Spinner";
import copy from "copy-to-clipboard";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link } from "react-router";
import { cn, truncatePublicKey } from "@/lib/utils";
import { useOutletContext } from "react-router";
export default function Account() {
  const { account, accountQuery, balances } = useOutletContext();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-4 bg-blue-600 text-white rounded-2xl">
          {/* Account Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-light truncate grow min-w-0 flex gap-2 items-center">
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

        {accountQuery.isPending ? (
          <Spinner />
        ) : accountQuery.isError ? (
          <QueryError />
        ) : (
          <div className="flex flex-col gap-2">
            {balances.map((balance, index) => (
              <AccountAsset
                key={index}
                as={Link}
                to={`asset/${
                  balance["asset_type"] === "native"
                    ? "XLM"
                    : balance["asset_issuer"]
                }`}
                asset={balance}
                icon={balance["asset_icon"]}
                domain={balance["asset_domain"]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
