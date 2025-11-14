import * as yup from "yup";
import Alert from "@/components/Alert";
import FieldStateError from "@/components/FieldStateError";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { PasswordInput } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { importAllKeys, removeAllKeys } from "@/lib/stellar/keyManager";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
  const setContacts = useAppStore((state) => state.setContacts);
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: null,
      pinCode,
    },
  });

  /** Import All */
  const importAll = async (file, pinCode) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener("load", async (ev) => {
        /** Parse JSON */
        const data = JSON.parse(ev.target.result);

        /** Remove all keys */
        await removeAllKeys();

        /** Add Keys */
        await importAllKeys(data.keys, pinCode);

        /** Update Accounts */
        setAccounts(data.accounts || []);

        /** Update Contacts */
        setContacts(data.contacts || []);

        /** Login */
        login(pinCode);

        /** Navigate to Home */
        navigate("/", {
          replace: true,
        });

        /** Resolve */
        resolve();
      });

      /** Handle Error */
      reader.addEventListener("error", (err) => {
        reject(err);
      });

      /** Read File */
      reader.readAsText(file);
    });
  };
  const mutation = useMutation({
    mutationKey: ["batch", "import"],
    mutationFn: async (data) => {
      await importAll(data.file, data.pinCode);
      return { status: true };
    },
  });

  /** Handle Submit */
  const handleFormSubmit = async ({ file, pinCode }) => {
    await mutation.mutateAsync({ file, pinCode });
    toast.success("Imported successfully!");
  };

  return (
    <InnerAppLayout className="gap-2">
      <Alert variant={isLoggedIn ? "warning" : "info"}>
        {isLoggedIn ? (
          <>All data will be replaced with imported ones</>
        ) : (
          <>
            Select a file exported through{" "}
            <span className="font-bold">
              {import.meta.env.VITE_APP_NAME} Batch Export
            </span>
          </>
        )}
      </Alert>

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
                  disabled={mutation.isPending}
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
                    disabled={mutation.isPending}
                  />
                  <FieldStateError fieldState={fieldState} />
                </>
              )}
            />
          ) : null}

          <PrimaryButton disabled={mutation.isPending} type="submit">
            <HiOutlineArrowDownTray className="size-5" />
            {mutation.isPending ? "Importing..." : "Import All"}
          </PrimaryButton>
        </form>
      </FormProvider>
    </InnerAppLayout>
  );
}
