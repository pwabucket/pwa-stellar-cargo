import * as yup from "yup";
import AccountAsset from "@/components/AccountAsset";
import AccountBelowReserveError from "@/components/AccountBelowReserveError";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { StrKey } from "@stellar/stellar-sdk";
import { createPaymentTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    address: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519PublicKey(str))
      .label("Address"),
    memo: yup.string().trim().nullable().label("MEMO"),
    amount: yup.string().trim().required().label("Amount"),
  })
  .required();

export default function Send() {
  const {
    account,
    accountQuery,
    asset,
    assetMeta,
    assetIcon,
    assetTransactionName,
    accountIsBelowReserve,
    accountReserveBalance,
  } = useOutletContext();
  const pinCode = useAppStore((state) => state.pinCode);

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
      memo: "",
      amount: "",
    },
  });

  const mutation = useMutation({
    mutationKey: [account.publicKey, assetTransactionName, "send"],
    mutationFn: async (data) => {
      const { address, memo, amount } = data;
      const transaction = await createPaymentTransaction({
        source: account.publicKey,
        destination: address,
        asset: assetTransactionName,
        memo,
        amount,
      });

      const signedTransaction = await signTransaction({
        keyId: account.keyId,
        transactionXDR: transaction["transaction"],
        network: transaction["network_passphrase"],
        pinCode,
      });

      /** Submit Transaction */
      const response = await submit(signedTransaction);

      return response;
    },
  });

  const handleFormSubmit = async (data) => {
    if (data.address === account.publicKey) {
      form.setError("address", {
        message: "Can't send to the same address",
      });
    } else {
      try {
        await mutation.mutateAsync(data);
        await accountQuery.refetch();
        form.reset();
      } catch (error) {
        console.warn("Error - Sending Asset");
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Below Reserve info */}
      {accountIsBelowReserve ? (
        <AccountBelowReserveError
          accountReserveBalance={accountReserveBalance}
        />
      ) : null}

      {/* Asset */}
      <AccountAsset
        asset={asset}
        icon={
          assetIcon[
            asset["asset_type"] === "native" ? "XLM" : asset["asset_issuer"]
          ]
        }
        domain={
          assetMeta[
            asset["asset_type"] === "native" ? "XLM" : asset["asset_issuer"]
          ]["domain"]
        }
      />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Address */}
          <Controller
            name="address"
            disabled={form.formState.isSubmitting}
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
            disabled={form.formState.isSubmitting}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"MEMO - Optional"}
                />
                <p className="text-blue-500 text-sm px-2">
                  Note: Required by exchanges
                </p>

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Amount */}
          <Controller
            name="amount"
            disabled={form.formState.isSubmitting}
            render={({ field, fieldState }) => (
              <>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    className="grow"
                    type="number"
                    spellCheck={false}
                    autoComplete={"off"}
                    placeholder={"Amount"}
                  />

                  {/* Max */}
                  <button
                    type="button"
                    onClick={() => field.onChange(asset["balance"])}
                    className="text-blue-500"
                  >
                    MAX
                  </button>
                </div>

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Submit Button */}
          <PrimaryButton disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Sending..." : "Send"}
          </PrimaryButton>
        </form>

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
          <p className="text-center text-red-500">Failed to Send</p>
        ) : null}
      </FormProvider>
    </div>
  );
}
