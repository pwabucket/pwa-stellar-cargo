import SendAsset from "@/partials/SendAsset";
import { useOutletContext } from "react-router";

export default function Send() {
  const { asset } = useOutletContext();
  return <SendAsset defaultAsset={asset["transaction_name"]} />;
}
