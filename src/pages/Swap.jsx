import SwapAsset from "@/partials/SwapAsset";
import { useOutletContext } from "react-router";

export default function Swap() {
  const { asset } = useOutletContext();
  return <SwapAsset defaultAsset={asset["transaction_name"]} />;
}
