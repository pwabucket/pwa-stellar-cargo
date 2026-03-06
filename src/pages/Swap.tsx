import type { AssetRouteContext } from "@/types/index.d.ts";
import SwapAsset from "@/partials/SwapAsset";
import { useOutletContext } from "react-router";

export default function Swap() {
  const { asset } = useOutletContext<AssetRouteContext>();
  return <SwapAsset defaultAsset={asset["transaction_name"]} />;
}
