import AssetValueMask from "@/components/AssetValueMask";
import useAppStore from "@/store/useAppStore";
import {
  AiOutlineMerge,
  AiOutlineSend,
  AiOutlineSplitCells,
  AiOutlineSwap,
} from "react-icons/ai";
import { HiOutlineEye } from "react-icons/hi2";
import { IoAddCircleOutline, IoCopyOutline } from "react-icons/io5";
import { Link, useOutletContext } from "react-router";
import { cn, copyToClipboard } from "@/lib/utils";

const PageLink = ({
  icon: Icon, // eslint-disable-line no-unused-vars
  title,
  ...props
}) => (
  <Link
    {...props}
    className={cn(
      "p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center",
      "flex gap-2 justify-center items-center"
    )}
  >
    <Icon className="size-4" />
    {title}
  </Link>
);

export default function Asset() {
  const { asset, assetValue } = useOutletContext();
  const toggleShowAssetValue = useAppStore(
    (state) => state.toggleShowAssetValue
  );

  return (
    <div className="flex flex-col gap-2">
      <div className=" p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <div className="flex gap-2">
          <img
            src={asset["asset_icon"]}
            className="size-10 shrink-0 rounded-full bg-white"
          />
          <div className="flex flex-col grow min-w-0">
            <h3 className="font-bold">
              {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
            </h3>
            <p className="text-xs">{asset["asset_domain"]}</p>

            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                <p className="font-bold text-2xl">
                  <AssetValueMask
                    prefix=""
                    value={asset["balance"]}
                    maskLength={10}
                    maximumFractionDigits={7}
                  />
                </p>
                <button onClick={toggleShowAssetValue}>
                  <HiOutlineEye className="size-6" />
                </button>
              </div>
              {assetValue ? (
                <p className="text-right text-neutral-500">
                  <AssetValueMask value={assetValue} />
                </p>
              ) : null}
              <p className="text-right">
                <a
                  href={`https://stellar.expert/explorer/public/asset/${asset["asset_id"]}`}
                  target="_blank"
                  className="text-blue-500"
                >
                  View Asset
                </a>
              </p>
            </div>
          </div>
        </div>

        {asset["asset_type"] !== "native" ? (
          <div className="flex flex-col">
            {/* Asset Code */}
            <p
              className="truncate cursor-pointer"
              onClick={() => copyToClipboard(asset["asset_code"])}
            >
              <IoCopyOutline className="size-4 inline-flex" />{" "}
              <span className="font-bold">Asset Code:</span>{" "}
              {asset["asset_code"]}
            </p>

            {/* Asset Issuer */}
            <p
              className="truncate cursor-pointer"
              onClick={() => copyToClipboard(asset["asset_issuer"])}
            >
              <IoCopyOutline className="size-4 inline-flex" />{" "}
              <span className="font-bold">Asset Issuer:</span>{" "}
              <span className="truncate">{asset["asset_issuer"]}</span>
            </p>

            {/* Add to Others */}
            <Link to={"add-to-others"} className="text-blue-500 mt-1">
              <IoAddCircleOutline className="size-4 inline-flex" /> Add to
              Others
            </Link>
          </div>
        ) : null}
      </div>

      {/* Send */}
      <PageLink to={"send"} icon={AiOutlineSend} title="Send" />

      {/* Swap */}
      <PageLink to={"swap"} icon={AiOutlineSwap} title="Swap" />

      {/* Merge */}
      <PageLink to={"merge"} icon={AiOutlineMerge} title="Merge" />

      {/* Split */}
      <PageLink to={"split"} icon={AiOutlineSplitCells} title="Split" />
    </div>
  );
}
