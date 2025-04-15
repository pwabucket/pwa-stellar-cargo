import AppIcon from "@/assets/images/icon.svg";
import LoginForm from "@/partials/LoginForm";
import WalletForm from "@/partials/WalletForm";
import useAppContext from "@/hooks/useAppContext";
import useAppStore from "@/store/useAppStore";
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import usePrompt from "@/hooks/usePrompt";
import { FaGoogleDrive } from "react-icons/fa";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { IoKeyOutline, IoLayersOutline } from "react-icons/io5";
import { Link } from "react-router";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { RiResetLeftFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { removeAllKeys } from "@/lib/stellar/keyManager";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import GoogleBackupPrompt from "./GoogleBackupPrompt";

export default function Welcome() {
  const { googleApi, googleDrive } = useAppContext();
  const login = useAppStore((state) => state.login);
  const accounts = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const setContacts = useAppStore((state) => state.setContacts);
  const setBackupFile = useGoogleAuthStore((state) => state.setBackupFile);
  const [showWalletForm, setShowWalletForm] = useState(false);

  const queryClient = useQueryClient();

  const { show, setShow, value, resolve, prompt } = usePrompt();
  const authorizeGoogleDrive = () =>
    googleDrive.authorize({ prompt, forceRestore: true });

  const onCreatedOrVerified = ({ pinCode }) => {
    login(pinCode);
  };

  /** Reset Wallet */
  const resetWallet = async () => {
    await googleApi.logout();
    await queryClient.removeQueries();
    await removeAllKeys();
    setBackupFile(null);
    setAccounts([]);
    setContacts([]);
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
        <p className="text-center text-neutral-500 dark:text-neutral-400">
          {import.meta.env.VITE_APP_DESCRIPTION}
        </p>
      </div>

      {accounts.length > 0 ? (
        <div className="flex flex-col gap-2">
          {/* Login Form */}
          <LoginForm onVerified={onCreatedOrVerified} />

          {/* Divider */}
          <p className="text-center text-neutral-500 dark:text-neutral-400">
            or
          </p>

          {/* Reset Wallet */}
          <button
            onClick={resetWallet}
            className="flex items-center justify-center gap-2"
          >
            <RiResetLeftFill className="size-4" />
            Reset Wallet
          </button>
        </div>
      ) : showWalletForm ? (
        <>
          <WalletForm onCreated={onCreatedOrVerified} />
          {/* Reset Wallet */}
          <button
            onClick={() => setShowWalletForm(false)}
            className="flex items-center justify-center gap-2"
          >
            <HiOutlineArrowLongLeft className="size-4" />
            Cancel Import
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <PrimaryButton
              onClick={() => setShowWalletForm(true)}
              className="text-center flex justify-center items-center gap-2"
            >
              <IoKeyOutline className="size-4" />
              Import Secret Key
            </PrimaryButton>

            <SecondaryButton
              as={Link}
              to="/batch-import"
              className="text-center flex justify-center items-center gap-2"
            >
              <IoLayersOutline className="size-4" />
              Batch Import
            </SecondaryButton>

            {/* Divider */}
            <p className="text-center text-neutral-500 dark:text-neutral-400">
              or
            </p>

            {/* Restore From Google Drive */}
            <button
              disabled={googleApi.initiated === false}
              onClick={authorizeGoogleDrive}
              className={cn(
                "flex items-center gap-2 justify-center disabled:opacity-50"
              )}
            >
              <FaGoogleDrive className="size-4" />
              Restore from Google Drive
            </button>

            {/* Google Backup Prompt */}
            <GoogleBackupPrompt
              backupFile={value}
              open={show}
              onOpenChange={setShow}
              resolve={resolve}
            />
          </div>

          <div className="flex justify-center gap-2 text-blue-500 dark:text-blue-400">
            <Link to="/about">About</Link>
            <span className="w-px  bg-neutral-200 dark:bg-neutral-700 " />
            <a href={import.meta.env.VITE_APP_REPOSITORY} target="_blank">
              Source
            </a>
          </div>
        </>
      )}
    </div>
  );
}
