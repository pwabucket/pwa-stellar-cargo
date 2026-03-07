import AssetValueMask from "@/components/AssetValueMask";
import Decimal from "decimal.js";
import type { EnrichedBalance } from "@/types/index.d.ts";
import useAssetPriceQuery from "@/hooks/useAssetPriceQuery";
import { useDebounce } from "react-use";
import { useState } from "react";

interface AssetValueProps {
  asset?: EnrichedBalance | null;
  amount?: Decimal.Value;
}

export default function AssetValue({ asset, amount = 0 }: AssetValueProps) {
  const [queryAmount, setQueryAmount] = useState(amount);

  const enabled =
    Boolean(asset) && new Decimal(queryAmount || 0).greaterThan(0);

  const query = useAssetPriceQuery(
    asset?.["asset_type"] === "native" ? "XLM" : asset?.["asset_code"] || "",
    asset?.["asset_issuer"] || "",
    queryAmount,
    {
      enabled,
    },
  );

  /** Debounce */
  useDebounce(
    () => {
      setQueryAmount(amount);
    },
    500,
    [amount, setQueryAmount],
  );

  return enabled ? (
    query.isPending ? (
      <div className="rounded-full w-10 h-3 bg-neutral-700 mx-1 shrink-0" />
    ) : query.isSuccess ? (
      <span className="inline-flex text-neutral-500 text-sm mx-1 shrink-0">
        <AssetValueMask forceShow value={query.data || 0} />
      </span>
    ) : null
  ) : null;
}
