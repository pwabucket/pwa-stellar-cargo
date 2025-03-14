import copy from "copy-to-clipboard";
import {
  AiOutlineMerge,
  AiOutlineSend,
  AiOutlineSplitCells,
  AiOutlineSwap,
} from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { Link, useOutletContext } from "react-router";
import { cn } from "@/lib/utils";

const PageLink = ({ icon: Icon, title, ...props }) => (
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
            <p className="text-right font-bold text-2xl">
              {Intl.NumberFormat("en-US", {
                maximumFractionDigits: 20,
              }).format(asset["balance"])}
            </p>
            {assetValue ? (
              <p className="text-right text-neutral-500">
                ~${Intl.NumberFormat().format(assetValue)}
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

        {asset["asset_type"] !== "native" ? (
          <div>
            {/* Asset Code */}
            <p
              className="truncate cursor-pointer"
              onClick={() => copy(asset["asset_code"])}
            >
              <IoCopyOutline className="size-4 inline-flex" />{" "}
              <span className="font-bold">Asset Code:</span>{" "}
              {asset["asset_code"]}
            </p>

            {/* Asset Issuer */}
            <p
              className="truncate cursor-pointer"
              onClick={() => copy(asset["asset_issuer"])}
            >
              <IoCopyOutline className="size-4 inline-flex" />{" "}
              <span className="font-bold">Asset Issuer:</span>{" "}
              <span className="truncate">{asset["asset_issuer"]}</span>
            </p>
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
