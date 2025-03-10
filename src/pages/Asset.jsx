import cn from "@/lib/utils";
import { AiOutlineMerge } from "react-icons/ai";
import { Link, useOutletContext } from "react-router";

export default function Asset() {
  const { asset, meta, assetValue } = useOutletContext();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
        <img
          src={meta["toml_info"]["image"]}
          className="size-10 shrink-0 rounded-full bg-white"
        />
        <div className="flex flex-col grow min-w-0">
          <h3 className="font-bold">
            {asset["asset_type"] === "native" ? "XLM" : asset["asset_code"]}
          </h3>
          <p className="text-xs">{meta["domain"]}</p>
          <p className="text-right font-bold text-2xl">
            {Intl.NumberFormat("en-US", {
              maximumFractionDigits: 20,
            }).format(asset["balance"])}
          </p>
          {assetValue ? (
            <p className="text-right text-neutral-500">
              ${Intl.NumberFormat().format(assetValue)}
            </p>
          ) : null}
          <p className="text-right">
            <a
              href={`https://stellar.expert/explorer/public/asset/${meta["asset"]}`}
              target="_blank"
              className="text-blue-500"
            >
              View Asset
            </a>
          </p>
        </div>
      </div>

      <Link
        to={"merge"}
        className={cn(
          "p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-center",
          "flex gap-2 justify-center items-center"
        )}
      >
        <AiOutlineMerge className="size-4" />
        Merge
      </Link>
    </div>
  );
}
