import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { StrKey } from "@stellar/stellar-sdk";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const walletFormSchema = yup
  .object({
    name: yup.string().trim().required().label("Name"),
    address: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519PublicKey(str))
      .label("Address"),
    memo: yup.string().trim().nullable().label("MEMO"),
  })
  .required();

export default function ContactForm({ contact, onSaved }) {
  const accounts = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);
  const addContact = useAppStore((state) => state.addContact);
  const updateContact = useAppStore((state) => state.updateContact);

  /** Form */
  const form = useForm({
    resolver: yupResolver(walletFormSchema),
    defaultValues: {
      name: contact?.name || "",
      address: contact?.address || "",
      memo: contact?.memo || "",
    },
  });

  const handleFormSubmit = async ({ name, address, memo }) => {
    if (accounts.some((item) => item.publicKey === address)) {
      return form.setError("address", {
        message: "Account already exists with same address!",
      });
    } else if (
      contacts.some(
        (item) =>
          item.id !== contact?.id &&
          item.address === address &&
          item.memo === memo
      )
    ) {
      return form.setError("address", {
        message: "Contact already exists with same address and MEMO!",
      });
    } else if (contact?.id) {
      /** Update Contact */
      updateContact(contact?.id, {
        name,
        address,
        memo,
      });

      return onSaved({
        id: contact?.id,
        name,
        address,
        memo,
      });
    } else {
      const data = {
        id: uuidv4(),
        name,
        address,
        memo,
      };

      /** Add Contact */
      addContact(data);

      /** Call Saved */
      return onSaved(data);
    }
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
                placeholder={"Name"}
              />

              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"Address"}
              />

              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* MEMO */}
        <Controller
          name="memo"
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                disabled={form.formState.isSubmitting}
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"MEMO (Optional)"}
              />
              <p className="text-blue-500 text-xs px-2">
                <span className="font-bold">MEMO</span> is required by exchanges
              </p>

              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Submit Button */}
        <PrimaryButton type="submit">Save</PrimaryButton>
      </form>
    </FormProvider>
  );
}
