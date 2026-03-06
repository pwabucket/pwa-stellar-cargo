import * as yup from "yup";

import { Controller, FormProvider, useForm } from "react-hook-form";

import FieldStateError from "@/components/FieldStateError";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { PasswordInput } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { loadKey } from "@/lib/stellar/keyManager";
import useAppStore from "@/store/useAppStore";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const loginSchema = yup
  .object({
    pinCode: yup.string().trim().required().label("PIN Code"),
  })
  .required();

interface LoginFormProps {
  onVerified: (data: { pinCode: string }) => void;
}

export default function LoginForm({ onVerified }: LoginFormProps) {
  const accounts = useAppStore((state) => state.accounts);
  /** Form */
  const form = useForm<{ pinCode: string }>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      pinCode: "",
    },
  });

  const handleFormSubmit = async ({ pinCode }: { pinCode: string }) => {
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
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"PIN Code"}
              />
              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Submit Button */}
        <PrimaryButton type="submit">
          <HiOutlineArrowRightOnRectangle className="size-5" />
          Login
        </PrimaryButton>
      </form>
    </FormProvider>
  );
}
