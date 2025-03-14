import * as yup from "yup";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { StrKey } from "@stellar/stellar-sdk";
import { createTrustlineTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    assetCode: yup.string().trim().required().label("Asset Code"),
    assetIssuer: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519PublicKey(str))
      .label("Asset Issuer"),
  })
  .required();

export default function AddTrustline() {
  const { account, balances, accountQuery } = useOutletContext();
  const pinCode = useAppStore((state) => state.pinCode);

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      assetCode: "",
      assetIssuer: "",
    },
  });

  const mutation = useMutation({
    mutationKey: [account.publicKey, "trustline", "add"],
    mutationFn: async (data) => {
      const { assetCode, assetIssuer } = data;
      const transaction = await createTrustlineTransaction({
        source: account.publicKey,
        assetCode,
        assetIssuer,
      });

      const signedTransaction = await signTransaction({
        keyId: account.keyId,
        transactionXDR: transaction["transaction"],
        network: transaction["network_passphrase"],
        pinCode,
      });

      /** Submit Transaction */
      const response = await submit(signedTransaction);

      /** Log Response */
      console.log(response);

      return response;
    },
  });

  const handleFormSubmit = async (data) => {
    if (
      balances.some(
        (item) =>
          item["asset_code"] === data.assetCode &&
          item["asset_issuer"] === data.assetIssuer
      )
    ) {
      form.setError("assetIssuer", {
        message: "A trustline with same code and issuer exists!",
      });
    } else {
      try {
        await mutation.mutateAsync(data);
        await accountQuery.refetch();
        form.reset();
      } catch (error) {
        console.warn("Error - Adding Trustline");
        console.error(error);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-2"
      >
        {/* Asset Code */}
        <Controller
          name="assetCode"
          disabled={form.formState.isSubmitting}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"Asset Code"}
              />
              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Asset Issuer */}
        <Controller
          name="assetIssuer"
          disabled={form.formState.isSubmitting}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                spellCheck={false}
                autoComplete={"off"}
                placeholder={"Asset Issuer"}
              />
              <FieldStateError fieldState={fieldState} />
            </>
          )}
        />

        {/* Submit Button */}
        <PrimaryButton disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Adding..." : "Add Trustline"}
        </PrimaryButton>

        {mutation.isSuccess ? (
          <p className="text-center text-green-500">
            Transaction was successful:{" "}
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/public/tx/${mutation.data.hash}`}
              className="text-blue-500"
            >
              View Details
            </a>
          </p>
        ) : mutation.isError ? (
          <p className="text-center text-red-500">Failed to Add Trustline</p>
        ) : null}
      </form>
    </FormProvider>
  );
}
