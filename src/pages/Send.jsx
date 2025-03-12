import * as Dialog from "@radix-ui/react-dialog";
import * as yup from "yup";
import AccountAsset from "@/components/AccountAsset";
import AccountBelowReserveError from "@/components/AccountBelowReserveError";
import AddressPicker from "@/partials/AddressPicker";
import FieldStateError from "@/components/FieldStateError";
import useAppStore from "@/store/useAppStore";
import { Controller, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { StrKey } from "@stellar/stellar-sdk";
import { cn } from "@/lib/utils";
import { createPaymentTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import { useLocation } from "react-router";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
  const accountList = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);
  const pinCode = useAppStore((state) => state.pinCode);
  const location = useLocation();
  const showAddressPicker = location.state?.__showAddressPicker === true;
  const navigate = useNavigate();

  /** Toggle Address Picker */
  const toggleAddressPicker = (show) => {
    if (show) {
      navigate(null, {
        state: {
          ...location.state,
          __showAddressPicker: true,
        },
      });
    } else {
      navigate(-1, { replace: true });
    }
  };

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
      memo: "",
      amount: "",
    },
  });

  const address = form.watch("address");
  const memo = form.watch("memo");
  const matchedAccount = useMemo(
    () =>
      StrKey.isValidEd25519PublicKey(address)
        ? accountList.find((item) => item.publicKey === address) ||
          contacts.find(
            (item) => item.address === address && item.memo === memo
          )
        : null,
    [address, memo, accountList, contacts]
  );

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

      /** Log Response */
      console.log(response);

      return response;
    },
  });

  /** Handle Form Submission */
  const handleFormSubmit = async (data) => {
    if (data.address === account.publicKey) {
      form.setError("address", {
        message: "Can't send to the same address",
      });
    } else if (parseFloat(data.amount) > parseFloat(asset["balance"])) {
      form.setError("amount", {
        message: "Amount is greater than balance!",
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

  /** Handle Picker */
  const handleAddressPicker = ({ address, memo }) => {
    form.setValue("address", address);
    form.setValue("memo", memo);
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
                {/* Matched Account */}
                {matchedAccount ? (
                  <p className="text-xs text-blue-500 font-bold px-2">
                    ({matchedAccount.name})
                  </p>
                ) : null}

                {/* Address Input */}
                <div className="flex gap-2">
                  <Input
                    {...field}
                    spellCheck={false}
                    className="grow min-w-0"
                    autoComplete={"off"}
                    placeholder={"Address"}
                  />

                  {/* Address Picker */}
                  <Dialog.Root
                    open={showAddressPicker}
                    onOpenChange={toggleAddressPicker}
                  >
                    <Dialog.Trigger
                      type="button"
                      disabled={field.disabled}
                      className={cn(
                        "text-blue-500 shrink-0",
                        "bg-neutral-100 dark:bg-neutral-800",
                        "px-3 rounded-xl",
                        "disabled:opacity-60"
                      )}
                    >
                      <HiOutlineBookOpen className="size-4" />
                    </Dialog.Trigger>
                    <AddressPicker
                      onSelect={handleAddressPicker}
                      publicKey={account.publicKey}
                    />
                  </Dialog.Root>
                </div>

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
                  placeholder={"MEMO (Optional)"}
                />
                <p className="text-blue-500 text-xs px-2">
                  <span className="font-bold">MEMO</span> is required by
                  exchanges
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
                    className="grow min-w-0"
                    type="number"
                    spellCheck={false}
                    autoComplete={"off"}
                    placeholder={"Amount"}
                  />

                  {/* Max */}
                  <button
                    type="button"
                    onClick={() => field.onChange(asset["balance"])}
                    className="text-blue-500 shrink-0"
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
