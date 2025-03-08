import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input, PasswordInput } from "@/components/Input";
import { Keypair, StrKey } from "@stellar/stellar-sdk";
import { PrimaryButton } from "@/components/Button";
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

  const handleFormSubmit = async ({ name, secretKey, pinCode }) => {
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
              <Input
                {...field}
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"Secret Key"}
              />
              {publicKey ? (
                <p className="text-xs text-blue-500 px-2 truncate">
                  Account: {publicKey}
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
        <PrimaryButton type="submit">Import</PrimaryButton>
      </form>
    </FormProvider>
  );
}
