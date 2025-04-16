import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import toast from "react-hot-toast";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { setupKeyManager } from "@/lib/stellar/keyManager";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const pinCodeFormSchema = yup
  .object({
    currentPinCode: yup.string().trim().required().label("Current PIN Code"),
    newPinCode: yup.string().trim().required().label("New PIN Code"),
  })
  .required();

export default function PinCode() {
  const pinCode = useAppStore((state) => state.pinCode);
  const accounts = useAppStore((state) => state.accounts);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const login = useAppStore((state) => state.login);

  /** Form */
  const form = useForm({
    resolver: yupResolver(pinCodeFormSchema),
    defaultValues: {
      currentPinCode: "",
      newPinCode: "",
    },
  });

  /** Handle Submit */
  const handleFormSubmit = async ({ currentPinCode, newPinCode }) => {
    if (currentPinCode !== pinCode) {
      return form.setError("currentPinCode", {
        message: "Incorrect PIN Code!",
      });
    } else if (newPinCode === pinCode) {
      return form.setError("newPinCode", {
        message: "New PIN Code is the same!",
      });
    } else {
      /** Update PIN Code */
      await setupKeyManager().changePassword({
        oldPassword: currentPinCode,
        newPassword: newPinCode,
      });

      /** Update PIN Code */
      login(newPinCode);

      /** Update Accounts */
      setAccounts([...accounts]);

      /** Reset Form */
      form.reset();

      /** Toast */
      toast.success("PIN Code Updated!");
    }
  };

  return (
    <InnerAppLayout headerTitle="PIN Code">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Current PIN Code */}
          <Controller
            name="currentPinCode"
            render={({ field, fieldState }) => (
              <>
                <PasswordInput
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"Current PIN Code"}
                />

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* New PIN Code */}
          <Controller
            name="newPinCode"
            render={({ field, fieldState }) => (
              <>
                <PasswordInput
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"New PIN Code"}
                />

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Submit Button */}
          <PrimaryButton disabled={form.formState.isSubmitting} type="submit">
            Save
          </PrimaryButton>
        </form>
      </FormProvider>
    </InnerAppLayout>
  );
}
