import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { PasswordInput } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { importAllKeys, removeAllKeys } from "@/lib/stellar/keyManager";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    file: yup
      .mixed()
      .required()
      .test((file) => file.type === "application/json")
      .label("File"),
    pinCode: yup.string().trim().required().label("PIN Code"),
  })
  .required();

export default function BatchImport() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const pinCode = useAppStore((state) => state.pinCode);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const navigate = useNavigate();

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: null,
      pinCode,
    },
  });

  const importAll = async (file, pinCode) => {
    const reader = new FileReader();

    reader.addEventListener("load", async (ev) => {
      /** Parse JSON */
      const data = JSON.parse(ev.target.result);

      /** Remove all keys */
      await removeAllKeys();

      /** Add Keys */
      await importAllKeys(data.keys, pinCode);

      /** Update Accounts */
      setAccounts(data.accounts);

      /** Navigate to Home */
      navigate("/", {
        replace: true,
      });
    });

    /** Read File */
    reader.readAsText(file);
  };

  /** Handle Submit */
  const handleFormSubmit = async ({ file, pinCode }) => {
    await importAll(file, pinCode);
  };

  return (
    <InnerAppLayout className="gap-2">
      {isLoggedIn ? (
        <p className="text-center p-2 rounded-xl bg-yellow-100 text-yellow-800">
          All accounts will be replaced with imported ones
        </p>
      ) : null}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* File */}
          <Controller
            name="file"
            render={({ field, fieldState }) => (
              <>
                <Input
                  name={field.name}
                  onChange={(ev) => field.onChange(ev.target.files[0])}
                  type="file"
                />

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* PIN Code */}
          {isLoggedIn === false ? (
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

          <PrimaryButton disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Importing..." : "Import All"}
          </PrimaryButton>
        </form>
      </FormProvider>
    </InnerAppLayout>
  );
}
