import AppIcon from "@/assets/images/icon.svg";
import LoginForm from "@/partials/LoginForm";
import WalletForm from "@/partials/WalletForm";
import useAppStore from "@/store/useAppStore";
import { PrimaryButton } from "@/components/Button";
import { useState } from "react";

export default function Welcome() {
  const login = useAppStore((state) => state.login);
  const accounts = useAppStore((state) => state.accounts);
  const [showWalletForm, setShowWalletForm] = useState(false);

  const onCreatedOrVerified = ({ pinCode }) => {
    login(pinCode);
  };

  return (
    <div className="min-h-dvh max-w-md mx-auto p-4 flex flex-col gap-4 justify-center">
      {/* App Icon */}
      <img src={AppIcon} className="h-24" />

      <div className="flex flex-col gap-1 px-4">
        {/* Title */}
        <h1 className="text-3xl text-center font-light">
          {import.meta.env.VITE_APP_NAME}
        </h1>

        {/* Description */}
        <p className="text-center text-neutral-500">
          {import.meta.env.VITE_APP_DESCRIPTION}
        </p>
      </div>

      {accounts.length >= 1 ? (
        <>
          <LoginForm onVerified={onCreatedOrVerified} />
        </>
      ) : showWalletForm ? (
        <WalletForm onCreated={onCreatedOrVerified} />
      ) : (
        <PrimaryButton onClick={() => setShowWalletForm(true)}>
          Import Secret Key
        </PrimaryButton>
      )}
    </div>
  );
}
