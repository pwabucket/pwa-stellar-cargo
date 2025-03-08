import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { PasswordInput } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { loadKey } from "@/lib/stellar/keyManager";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const loginSchema = yup
  .object({
    pinCode: yup.string().trim().required().label("PIN Code"),
  })
  .required();

export default function LoginForm({ onVerified }) {
  const accounts = useAppStore((state) => state.accounts);
  /** Form */
  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      pinCode: "",
    },
  });

  const handleFormSubmit = async ({ pinCode }) => {
    try {
      await loadKey(accounts[0].keyId, pinCode);
      onVerified({ pinCode });
    } catch {
      form.setError("pinCode", {
        message: "Invalid PIN Code",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-2"
      >
        {/* PIN Code */}
        <Controller
          name="pinCode"
          render={({ field, fieldState }) => (
            <>
              <PasswordInput
                {...field}
                autoComplete={"off"}
                placeholder={"PIN Code"}
              />
              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Submit Button */}
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    </FormProvider>
  );
}
