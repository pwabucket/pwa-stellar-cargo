import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAccount from "@/hooks/useAccount";
import useAppContext from "@/hooks/useAppContext";
import useAppStore from "@/store/useAppStore";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { Input } from "@/components/Input";
import { IoCopyOutline } from "react-icons/io5";
import { PrimaryButton } from "@/components/Button";
import { cn, copyToClipboard } from "@/lib/utils";
import { loadKey, setupKeyManager } from "@/lib/stellar/keyManager";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    name: yup.string().trim().label("Account Name"),
  })
  .required();

const ToolButton = ({
  icon: Icon, // eslint-disable-line no-unused-vars
  ...props
}) => (
  <button
    {...props}
    type="button"
    className={cn(
      "bg-neutral-100 dark:bg-neutral-800",
      "flex items-center justify-center",
      "px-3 rounded-xl shrink-0",
      props.className
    )}
  >
    <Icon className="size-5" />
  </button>
);

export default function EditAccount() {
  const { publicKey } = useParams();
  const { resetWallet } = useAppContext();
  const pinCode = useAppStore((state) => state.pinCode);
  const allAccounts = useAppStore((state) => state.accounts);
  const removeAccount = useAppStore((state) => state.removeAccount);
  const updateAccount = useAppStore((state) => state.updateAccount);

  const account = useAccount(publicKey);
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState("");

  /** Can Remove Account */
  const canRemoveAccount = allAccounts.length > 1;

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: account?.name,
    },
  });

  const handleFormSubmit = ({ name }) => {
    /** Update Account */
    updateAccount({
      ...account,
      name,
    });

    /** Return */
    navigate(-1, { replace: true });
  };

  /** Reveal Secret Key */
  const revealSecretKey = async () => {
    const result = await loadKey(account.keyId, pinCode);
    setSecretKey(result.privateKey);
  };

  /** Handle Account Removal */
  const handleAccountRemoval = useCallback(async () => {
    if (canRemoveAccount) {
      await setupKeyManager().removeKey(account.keyId);
      removeAccount(publicKey);
      navigate("/app", { replace: true });
    } else {
      await resetWallet();
    }
  }, [
    canRemoveAccount,
    account?.keyId,
    publicKey,
    removeAccount,
    resetWallet,
    navigate,
  ]);

  /** Redirect */
  useCheckOrNavigate(account, "/app", {
    replace: true,
  });

  return account ? (
    <InnerAppLayout
      headerTitle="Edit Account"
      headerRightContent={
        <HeaderButton
          onClick={handleAccountRemoval}
          className="text-red-500"
          icon={HiOutlineTrash}
        />
      }
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Name */}
          <Controller
            name="name"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"Account Name"}
                />

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Public Key */}
          <div className="flex gap-2">
            <Input
              readOnly
              spellCheck={false}
              value={account.publicKey}
              placeholder={"Public Key"}
              className="grow min-w-0"
            />

            <ToolButton
              icon={IoCopyOutline}
              onClick={() => copyToClipboard(account.publicKey)}
            />
          </div>

          {/* Secret Key */}
          <div className="flex gap-2">
            <Input
              readOnly
              spellCheck={false}
              value={secretKey}
              placeholder={"Reveal Secret Key"}
              className="grow min-w-0"
            />
            {secretKey ? (
              <ToolButton
                icon={IoCopyOutline}
                onClick={() => copyToClipboard(secretKey)}
              />
            ) : (
              <ToolButton icon={HiOutlineEye} onClick={revealSecretKey} />
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" className="my-2">
            Save
          </PrimaryButton>
        </form>
      </FormProvider>
    </InnerAppLayout>
  ) : (
    <FullPageSpinner />
  );
}
