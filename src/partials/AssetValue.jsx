import AssetValueMask from "@/components/AssetValueMask";
import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import { useDebounce } from "react-use";
import { useState } from "react";

export default function AssetValue({ asset, amount = 0 }) {
  const [queryAmount, setQueryAmount] = useState(amount);

  const enabled = Boolean(asset) && queryAmount > 0;

  const query = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"],
    asset?.["asset_issuer"],
    amount,
    {
      enabled,
    }
  );

  /** Debounce */
  useDebounce(
    () => {
      setQueryAmount(amount);
    },
    500,
    [amount, setQueryAmount]
  );

  return enabled ? (
    query.isPending ? (
      <div className="rounded-full w-10 h-3 bg-slate-700 mx-1 shrink-0" />
    ) : query.isSuccess ? (
      <span className="inline-flex text-slate-500 text-sm mx-1 shrink-0">
        <AssetValueMask forceShow value={query.data} />
      </span>
    ) : null
  ) : null;
}
