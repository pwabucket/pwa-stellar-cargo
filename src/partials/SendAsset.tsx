import * as yup from "yup";

import type {
  AccountRouteContext,
  EnrichedBalance,
  HorizonBalance,
} from "@/types/index.d.ts";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineBookOpen, HiOutlinePlusCircle } from "react-icons/hi2";
import { calculateAssetMaxAmount, cn } from "@/lib/utils";

import AccountAsset from "@/components/AccountAsset";
import AddressPicker from "@/partials/AddressPicker";
import AssetPicker from "./AssetPicker";
import AssetValue from "./AssetValue";
import Decimal from "decimal.js";
import { Dialog } from "@/components/Dialog";
import FieldStateError from "@/components/FieldStateError";
import { FormProvider } from "react-hook-form";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import RequiredReserve from "@/components/RequiredReserve";
import { StrKey } from "@stellar/stellar-sdk";
import TransactionsFee from "@/components/TransactionsFee";
import { createPaymentTransaction } from "@/lib/stellar/transactions";
import { signTransaction } from "@/lib/stellar/keyManager";
import { submit } from "@/lib/stellar/horizonQueries";
import useAppStore from "@/store/useAppStore";
import { useLocationToggle } from "@pwabucket/pwa-router";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    asset: yup.string().trim().required().label("Asset"),
    address: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519PublicKey(str))
      .label("Address"),
    memo: yup.string().default("").trim().label("MEMO"),
    amount: yup.string().trim().required().label("Amount"),
  })
  .required();

interface SendAssetProps {
  defaultAsset?: string;
}

interface SendAssetFormValues {
  asset: string;
  address: string;
  memo: string;
  amount: string;
}

export default function SendAsset({ defaultAsset = "" }: SendAssetProps) {
  const { account, balances, accountQuery, accountReserveBalance } =
    useOutletContext<AccountRouteContext>();
  const accountList = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);
  const pinCode = useAppStore((state) => state.pinCode);
  const [showAddressPicker, toggleAddressPicker] = useLocationToggle(
    "__showAddressPicker",
  );
  const [showAssetPicker, toggleAssetPicker] =
    useLocationToggle("__showAssetPicker");

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      asset: defaultAsset,
      address: "",
      memo: "",
      amount: "",
    },
  });

  const asset = form.watch("asset");
  const amount = form.watch("amount");
  const selectedAsset = useMemo(
    () => balances.find((item) => item["transaction_name"] === asset),
    [balances, asset],
  );

  const maxAmount = useMemo(
    () =>
      calculateAssetMaxAmount(
        selectedAsset as unknown as HorizonBalance,
        accountReserveBalance,
      ),
    [selectedAsset, accountReserveBalance],
  );

  const address = form.watch("address");
  const memo = form.watch("memo");
  const matchedAccount = useMemo(
    () =>
      StrKey.isValidEd25519PublicKey(address)
        ? accountList.find((item) => item.publicKey === address) ||
          contacts.find(
            (item) => item.address === address && item.memo === memo,
          )
        : null,
    [address, memo, accountList, contacts],
  );

  const mutation = useMutation({
    mutationKey: [account.publicKey, "asset", "send"],
    mutationFn: async (data: SendAssetFormValues) => {
      const { asset, address, memo, amount } = data;
      const transaction = await createPaymentTransaction({
        source: account.publicKey,
        destination: address,
        asset,
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
  const handleFormSubmit = async (data: SendAssetFormValues) => {
    if (data.address === account.publicKey) {
      form.setError("address", {
        message: "Can't send to the same address",
      });
    } else if (new Decimal(data.amount).greaterThan(new Decimal(maxAmount))) {
      form.setError("amount", {
        message: "Amount is greater than available balance!",
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
  const handleAddressPicker = ({
    address,
    memo,
  }: {
    address: string;
    memo: string;
  }) => {
    form.setValue("address", address);
    form.setValue("memo", memo);
  };

  /** Handle Picker */
  const handleAssetPicker = (asset: EnrichedBalance) => {
    form.setValue("asset", asset["transaction_name"] || "");
    form.setValue("amount", "");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Reserve Info */}
      <RequiredReserve />

      {/* Fee */}
      <TransactionsFee />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Asset */}
          <Controller
            name="asset"
            render={({ fieldState }) => (
              <>
                {/* Asset */}
                {defaultAsset ? (
                  <AccountAsset asset={selectedAsset!} />
                ) : (
                  <Dialog.Root
                    open={showAssetPicker}
                    onOpenChange={toggleAssetPicker}
                  >
                    {selectedAsset ? (
                      <AccountAsset
                        disabled={form.formState.isSubmitting}
                        as={Dialog.Trigger}
                        asset={selectedAsset}
                      />
                    ) : (
                      <Dialog.Trigger
                        type="button"
                        disabled={form.formState.isSubmitting}
                        className={cn(
                          "bg-neutral-900",
                          "p-4 rounded-xl text-sm font-bold",
                          "flex gap-2 items-center",
                          "disabled:opacity-60",
                        )}
                      >
                        <HiOutlinePlusCircle className="size-6" />
                        Choose an Asset
                      </Dialog.Trigger>
                    )}

                    <AssetPicker
                      open={showAssetPicker}
                      assets={balances}
                      onSelect={handleAssetPicker}
                    />
                  </Dialog.Root>
                )}

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Address */}
          <Controller
            name="address"
            render={({ field, fieldState }) => (
              <>
                {/* Matched Account */}
                {matchedAccount ? (
                  <p className="text-xs text-blue-400 font-bold px-2">
                    ({matchedAccount.name})
                  </p>
                ) : null}

                {/* Address Input */}
                <div className="flex gap-2">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
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
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        "text-blue-400 shrink-0",
                        "bg-neutral-900",
                        "px-3 rounded-full",
                        "disabled:opacity-60",
                      )}
                    >
                      <HiOutlineBookOpen className="size-4" />
                    </Dialog.Trigger>
                    <AddressPicker
                      open={showAddressPicker}
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
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  disabled={form.formState.isSubmitting}
                  spellCheck={false}
                  autoComplete={"off"}
                  placeholder={"MEMO (Optional)"}
                />
                <p className="text-blue-400 text-xs px-2">
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
            render={({ field, fieldState }) => (
              <>
                <div className="flex gap-2 mt-3">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    className="grow min-w-0"
                    type="number"
                    spellCheck={false}
                    autoComplete={"off"}
                    placeholder={"Amount"}
                  />

                  {/* Max */}
                  <button
                    type="button"
                    disabled={form.formState.isSubmitting}
                    onClick={() => field.onChange(maxAmount)}
                    className="text-blue-400 shrink-0 disabled:opacity-60"
                  >
                    MAX
                  </button>
                </div>

                <div className="flex">
                  <AssetValue asset={selectedAsset} amount={amount} />
                  <FieldStateError fieldState={fieldState} />
                </div>
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
              className="text-blue-400"
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
