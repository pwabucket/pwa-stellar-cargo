import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAccount from "@/hooks/useAccount";
import useAppStore from "@/store/useAppStore";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { setupKeyManager } from "@/lib/stellar/keyManager";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    name: yup.string().trim().label("Account Name"),
  })
  .required();

export default function EditAccount() {
  const { publicKey } = useParams();
  const removeAccount = useAppStore((state) => state.removeAccount);
  const updateAccount = useAppStore((state) => state.updateAccount);
  const account = useAccount(publicKey);
  const navigate = useNavigate();

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

  const handleAccountRemoval = useCallback(async () => {
    await setupKeyManager().removeKey(account.keyId);
    removeAccount(publicKey);
    navigate("/app", { replace: true });
  }, [account?.keyId, publicKey, removeAccount, navigate]);

  /** Redirect */
  useCheckOrNavigate(account, "/app", {
    replace: true,
  });

  return account ? (
    <InnerAppLayout
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
                  autoComplete={"off"}
                  placeholder={"Account Name"}
                />

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Public Key */}
          <Input
            readOnly
            value={account.publicKey}
            placeholder={"Public Key"}
          />

          {/* Submit Button */}
          <PrimaryButton type="submit">Update</PrimaryButton>
        </form>
      </FormProvider>
    </InnerAppLayout>
  ) : (
    <FullPageSpinner />
  );
}
