import type { AssetRouteContext } from "@/types/index.d.ts";
import SendAsset from "@/partials/SendAsset";
import { useOutletContext } from "react-router";

export default function Send() {
  const { asset } = useOutletContext<AssetRouteContext>();
  return <SendAsset defaultAsset={asset["transaction_name"]} />;
}
