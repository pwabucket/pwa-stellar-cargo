import QueryError from "@/components/QueryError";
import Spinner from "@/components/Spinner";
import copy from "copy-to-clipboard";
import cn, { truncatePublicKey } from "@/lib/utils";
import { HiPencil } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link } from "react-router";
import { useOutletContext } from "react-router";
export default function Account() {
  const { account, accountQuery, assetMeta, assetIcon } = useOutletContext();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-4 bg-blue-500 text-white rounded-2xl">
          {/* Account Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold truncate grow min-w-0">
              {account.name || "Stellar Account"}
            </h2>

            {/* Edit Button */}
            <Link
              to={`edit`}
              className={cn(
                "shrink-0 bg-blue-400 size-9",
                "flex items-center justify-center",
                "rounded-full"
              )}
            >
              <HiPencil className="size-4" />
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
            <h3 className="text-blue-100 truncate grow min-w-0 font-bold">
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
          <div className="flex flex-col gap-1">
            {accountQuery.data.balances.map((balance, index) => (
              <Link
                key={index}
                to={`asset/${
                  balance["asset_type"] === "native"
                    ? "XLM"
                    : balance["asset_issuer"]
                }`}
                className={cn(
                  "p-2 rounded-xl",
                  "bg-neutral-100 hover:bg-neutral-200",
                  "flex items-center gap-2"
                )}
              >
                {/* Icon */}
                <img
                  src={
                    assetIcon[
                      balance["asset_type"] === "native"
                        ? "XLM"
                        : balance["asset_issuer"]
                    ]
                  }
                  className={cn(
                    "shrink-0 size-8 rounded-full",
                    "bg-neutral-200"
                  )}
                />

                {/* Asset Type */}
                <div className="flex flex-col grow min-w-0">
                  <h4 className=" truncate">
                    {balance["asset_type"] === "native"
                      ? "XLM"
                      : balance["asset_code"]}
                  </h4>
                  <p className="text-xs">
                    {
                      assetMeta[
                        balance["asset_type"] === "native"
                          ? "XLM"
                          : balance["asset_issuer"]
                      ]["domain"]
                    }
                  </p>
                </div>

                {/* Balance */}
                <p className="shrink-0 font-bold">
                  {Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 20,
                  }).format(balance["balance"])}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
