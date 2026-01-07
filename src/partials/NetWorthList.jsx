import AssetValueMask from "@/components/AssetValueMask";
import useAppStore from "@/store/useAppStore";
import { Collapsible } from "radix-ui";
import { HiEye, HiOutlineChevronDown } from "react-icons/hi2";

export default function NetWorthList({ isSuccess, assets, totalNetWorth }) {
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue
  );

  return (
    <>
      {isSuccess ? (
        <>
          <div className="flex items-center gap-2">
            <button className="shrink-0" onClick={toggleShowAssetValue}>
              <HiEye className="size-6" />
            </button>
            <p className="text-3xl font-bold">
              <AssetValueMask value={totalNetWorth} maskLength={10} />
            </p>
          </div>

          {/* Toggle */}
          <Collapsible.Root className="flex flex-col gap-2">
            <Collapsible.Trigger className="flex items-center gap-2 justify-center text-sm font-bold">
              <HiOutlineChevronDown className="size-5" />
              Toggle Details
            </Collapsible.Trigger>
            <Collapsible.Content className="flex flex-col gap-1">
              {assets.map((item) => (
                <div
                  key={item["asset_id"]}
                  className="flex gap-2 items-center px-3 py-1 bg-blue-600 rounded-xl"
                >
                  <img
                    src={item["asset_icon"]}
                    className="size-5 rounded-full shrink-0"
                  />
                  <div className="flex flex-col grow min-w-0">
                    {/* Name */}
                    <h4 className="truncate font-bold">{item["asset_name"]}</h4>

                    {/* Domain */}
                    <p className="text-xs">{item["asset_domain"]}</p>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end text-right">
                    <p className="font-bold">
                      <AssetValueMask
                        value={item["balance"]}
                        maskLength={10}
                        prefix=""
                      />
                    </p>
                    <p className="text-white/70 text-sm">
                      <AssetValueMask value={item["usd_value"]} />
                    </p>
                  </div>
                </div>
              ))}
            </Collapsible.Content>
          </Collapsible.Root>
        </>
      ) : (
        <>
          <div className="bg-blue-500 rounded-full h-4 w-1/2 animate-pulse" />
        </>
      )}
    </>
  );
}
