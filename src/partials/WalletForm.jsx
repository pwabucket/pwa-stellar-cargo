import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input, PasswordInput } from "@/components/Input";
import { Keypair, StrKey } from "@stellar/stellar-sdk";
import { LuRotateCcw } from "react-icons/lu";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import { cn, truncatePublicKey } from "@/lib/utils";
import { storeKey } from "@/lib/stellar/keyManager";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const walletFormSchema = yup
  .object({
    name: yup.string().trim().label("Account Name"),
    secretKey: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519SecretSeed(str))
      .label("Secret Key"),

    pinCode: yup.string().trim().required().label("PIN Code"),
  })
  .required();

export default function WalletForm({ pinCode = "", onCreated }) {
  const accounts = useAppStore((state) => state.accounts);
  const addAccount = useAppStore((state) => state.addAccount);

  /** Form */
  const form = useForm({
    resolver: yupResolver(walletFormSchema),
    defaultValues: {
      name: `Account ${accounts.length + 1}`,
      secretKey: "",
      pinCode,
    },
  });

  const secretKey = form.watch("secretKey");
  const publicKey = StrKey.isValidEd25519SecretSeed(secretKey)
    ? Keypair.fromSecret(secretKey).publicKey()
    : null;

  const generateSecretKey = () => {
    form.setValue("secretKey", Keypair.random().secret());
  };

  const handleFormSubmit = async ({ name, secretKey, pinCode }) => {
    const alreadyExists = accounts.some((item) => item.publicKey === publicKey);

    if (alreadyExists) {
      return form.setError("secretKey", {
        message: "Account already exists!",
      });
    }

    const { id: keyId } = await storeKey({
      publicKey,
      secretKey,
      pinCode,
    });

    const account = {
      keyId,
      name,
      publicKey,
    };

    /** Store Account */
    addAccount(account);

    /** Callback */
    onCreated({
      ...account,
      pinCode,
    });
  };

  return (
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

        {/* Secret Key */}
        <Controller
          name="secretKey"
          render={({ field, fieldState }) => (
            <>
              <div className="relative">
                <Input
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"Secret Key"}
                  className="pr-10 w-full"
                />

                <button
                  onClick={generateSecretKey}
                  title="Generate Secret Key"
                  type="button"
                  className={cn(
                    "absolute inset-y-0 right-0",
                    "w-10 outline-0",
                    "flex items-center justify-center",
                    "hover:bg-slate-700",
                    "rounded-r-full disabled:opacity-60"
                  )}
                >
                  <LuRotateCcw className="size-6" />
                </button>
              </div>
              {publicKey ? (
                <p className="text-xs text-blue-500 px-2 truncate">
                  Account: {truncatePublicKey(publicKey, 12)}
                </p>
              ) : null}
              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* PIN Code */}
        {pinCode === "" ? (
          <Controller
            name="pinCode"
            render={({ field, fieldState }) => (
              <>
                <PasswordInput
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"PIN Code"}
                />
                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />
        ) : null}

        {/* Submit Button */}
        <PrimaryButton type="submit">
          <HiOutlineArrowDownTray className="size-5" />
          Import
        </PrimaryButton>
      </form>
    </FormProvider>
  );
}
