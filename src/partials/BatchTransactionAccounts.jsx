import Spinner from "@/components/Spinner";
import Toggle from "@/components/Toggle";
import { BsFillSkipForwardCircleFill } from "react-icons/bs";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi2";
import { cn, truncatePublicKey } from "@/lib/utils";
import AccountImage from "@/components/AccountImage";

export default function BatchTransactionAccounts({
  results,
  accounts,
  isProcessing,
  activeAccounts,
  selectedAccounts,
  toggleAccount,
  toggleAllAccounts,
}) {
  return (
    <>
      {/* Accounts */}
      {results.size === 0 && !isProcessing ? (
        <label
          className={cn(
            "group rounded-full px-3 py-2",
            "border border-neutral-900",
            "flex items-center gap-4",
            "grow min-w-0",
            "cursor-pointer select-none"
          )}
        >
          <Toggle
            checked={selectedAccounts.size === accounts.length}
            onChange={(ev) => toggleAllAccounts(ev.target.checked)}
          />

          {/* Account Name */}
          <h4 className="truncate grow min-w-0">Toggle Accounts</h4>
        </label>
      ) : null}

      <div className="flex flex-col divide-y divide-neutral-900">
        {accounts.map((source) => (
          <div key={source.keyId} className="flex items-center gap-2">
            <label
              className={cn(
                "group px-3 py-2",
                "flex items-center gap-4",
                "grow min-w-0",
                "cursor-pointer select-none"
              )}
            >
              {/* Indicator */}
              {results.has(source.publicKey) ? (
                results.get(source.publicKey).status ? (
                  results.get(source.publicKey).skipped ? (
                    <BsFillSkipForwardCircleFill className="size-5 text-yellow-500" />
                  ) : (
                    <HiCheckCircle className="text-green-500 size-5" />
                  )
                ) : (
                  <HiXCircle className="text-red-500 size-5" />
                )
              ) : isProcessing ? (
                activeAccounts.has(source.publicKey) ? (
                  <Spinner />
                ) : (
                  <HiClock className="size-4" />
                )
              ) : (
                <Toggle
                  checked={selectedAccounts.has(source.publicKey)}
                  onChange={(ev) => toggleAccount(source, ev.target.checked)}
                />
              )}

              <AccountImage
                publicKey={source.publicKey}
                className="size-6 rounded-full"
              />

              {/* Account Name */}
              <h4 className="truncate grow min-w-0 font-bold">
                {source.name || "Stellar Account"}
              </h4>

              {/* Account Public Key */}
              <p className={cn("truncate", "text-xs text-blue-200")}>
                {truncatePublicKey(source.publicKey)}
              </p>
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
