import InnerAppLayout from "@/layouts/InnerAppLayout";
import WalletForm from "@/partials/WalletForm";
import useAppStore from "@/store/useAppStore";
import { useNavigate } from "react-router";

export default function ImportWallet() {
  const navigate = useNavigate();
  const pinCode = useAppStore((state) => state.pinCode);

  const onCreated = ({ publicKey }) => {
    navigate(`/accounts/${publicKey}`, {
      replace: true,
    });
  };

  return (
    <InnerAppLayout headerTitle="Import Wallet">
      <WalletForm pinCode={pinCode} onCreated={onCreated} />
    </InnerAppLayout>
  );
}
