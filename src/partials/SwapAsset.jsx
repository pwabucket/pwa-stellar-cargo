import * as Dialog from "@radix-ui/react-dialog";
import * as yup from "yup";
import AccountAsset from "@/components/AccountAsset";
import AssetPicker from "@/partials/AssetPicker";
import FieldStateError from "@/components/FieldStateError";
import RequiredReserve from "@/components/RequiredReserve";
import TransactionsFee from "@/components/TransactionsFee";
import useAppStore from "@/store/useAppStore";
import useLocationToggle from "@/hooks/useLocationToggle";
import { Controller, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { HiOutlineArrowLongDown, HiOutlineArrowPath } from "react-icons/hi2";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { calculateAssetMaxAmount, cn } from "@/lib/utils";
import { createPathPaymentStrictSendTransaction } from "@/lib/stellar/transactions";
import {
  findStrictReceivePaths,
  findStrictSendPaths,
  submit,
} from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { useDebounce } from "react-use";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router";
import { useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import AssetValue from "./AssetValue";

/** Schema */
const schema = yup
  .object({
    asset: yup.string().trim().required().label("Asset"),
    amount: yup.string().trim().required().label("Amount"),
    receivedAsset: yup.string().trim().required().label("Received Asset"),
    receivedAmount: yup.string().trim().required().label("Received Amount"),
  })
  .required();

const AssetPickerTrigger = ({ asset, disabled }) => (
  <Dialog.Trigger
    type="button"
    disabled={disabled}
    className={cn(
      "shrink-0",
      "bg-neutral-100 dark:bg-neutral-800",
      "px-3 rounded-xl text-sm",
      "flex gap-2 items-center",
      "disabled:opacity-60"
    )}
  >
    {asset ? (
      <>
        <img
          src={asset?.["asset_icon"]}
          className={cn("shrink-0 size-5 rounded-full", "bg-white")}
        />
        {asset["asset_name"]}
      </>
    ) : (
      <>Choose</>
    )}
  </Dialog.Trigger>
);

export default function SwapAsset({ defaultAsset = "" }) {
  const { account, balances, accountQuery, accountReserveBalance } =
    useOutletContext();
  const pinCode = useAppStore((state) => state.pinCode);

  const [showSourceAssetPicker, toggleSourceAssetPicker] = useLocationToggle(
    "__showSourceAssetPicker"
  );

  const [showReceivedAssetPicker, toggleReceivedAssetPicker] =
    useLocationToggle("__showReceivedAssetPicker");

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      asset: defaultAsset || balances[0]?.["transaction_name"],
      amount: "",
      receivedAsset: "",
      receivedAmount: "",
    },
  });

  const accountPublicKey = account.publicKey;
  const calculatorRef = useRef({
    calculatedSource: false,
    calculatedReceived: false,
  });

  const sourceAsset = form.watch("asset");
  const sourceAmount = form.watch("amount");
  const receivedAsset = form.watch("receivedAsset");
  const receivedAmount = form.watch("receivedAmount");

  const selectedSourceAsset = useMemo(
    () => balances.find((item) => item["transaction_name"] === sourceAsset),
    [sourceAsset, balances]
  );

  const selectedReceivedAsset = useMemo(
    () => balances.find((item) => item["transaction_name"] === receivedAsset),
    [receivedAsset, balances]
  );

  const otherSourceAssets = useMemo(
    () => balances.filter((item) => item["transaction_name"] !== receivedAsset),
    [receivedAsset, balances]
  );

  const otherReceivedAssets = useMemo(
    () => balances.filter((item) => item["transaction_name"] !== sourceAsset),
    [sourceAsset, balances]
  );

  const maxAmount = useMemo(
    () => calculateAssetMaxAmount(selectedSourceAsset, accountReserveBalance),
    [selectedSourceAsset, accountReserveBalance]
  );

  const swapMutation = useMutation({
    mutationKey: [accountPublicKey, "swap", sourceAsset],
    mutationFn: async () => {
      const transaction = await createPathPaymentStrictSendTransaction({
        source: accountPublicKey,
        sourceAsset: sourceAsset,
        sourceAmount: sourceAmount,
        destination: accountPublicKey,
        destinationAsset: receivedAsset,
        destinationAmount: receivedAmount,
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
    if (parseFloat(data.amount) > parseFloat(maxAmount)) {
      form.setError("amount", {
        message: "Amount is greater than available balance!",
      });
    } else {
      await swapMutation.mutateAsync(data);
      await accountQuery.refetch();
      form.setValue("amount", "");
      form.setValue("receivedAmount", "");
    }
  };

  /** Handle Picker */
  const handleSourceAssetPicker = (asset) => {
    calculatorRef.current.calculatedSource = true;
    calculatorRef.current.calculatedReceived = false;
    form.setValue("asset", asset["transaction_name"]);
  };

  /** Handle Picker */
  const handleReceivedAssetPicker = (asset) => {
    calculatorRef.current.calculatedSource = false;
    calculatorRef.current.calculatedReceived = true;
    form.setValue("receivedAsset", asset["transaction_name"]);
  };

  const switchAssets = () => {
    calculatorRef.current.calculatedSource = true;
    calculatorRef.current.calculatedReceived = true;

    form.setValue("asset", receivedAsset);
    form.setValue("amount", receivedAmount);
    form.setValue("receivedAsset", sourceAsset);
    form.setValue("receivedAmount", sourceAmount);
  };

  const sendPathsMutation = useMutation({
    mutationKey: [accountPublicKey, "send", sourceAsset],
    mutationFn: () =>
      findStrictSendPaths({
        destinationAsset: receivedAsset,
        sourceAsset: sourceAsset,
        sourceAmount: sourceAmount,
      }),
  });

  const receivedPathsMutation = useMutation({
    mutationKey: [accountPublicKey, "receive", sourceAsset],
    mutationFn: () =>
      findStrictReceivePaths({
        sourceAsset: sourceAsset,
        destinationAsset: receivedAsset,
        destinationAmount: receivedAmount,
      }),
  });

  /** Calculte Received Amount  */
  useDebounce(
    () => {
      if (calculatorRef.current.calculatedSource) {
        calculatorRef.current.calculatedSource = false;
      } else if (!sourceAsset || !receivedAsset) {
        return;
      } else if (sourceAmount > 0) {
        sendPathsMutation.mutateAsync().then((results) => {
          /** Mark as Calculated */
          calculatorRef.current.calculatedReceived = true;

          const item = results[0];
          if (item) {
            form.setValue("receivedAmount", item["destination_amount"]);
          }
        });
      } else {
        form.setValue("receivedAmount", "");
      }
    },
    500,
    [
      form,
      sourceAsset,
      sourceAmount,
      receivedAsset,
      sendPathsMutation.mutateAsync,
    ]
  );

  /** Calculate Source Amount  */
  useDebounce(
    () => {
      if (calculatorRef.current.calculatedReceived) {
        calculatorRef.current.calculatedReceived = false;
      } else if (!sourceAsset || !receivedAsset) {
        return;
      } else if (receivedAmount > 0) {
        receivedPathsMutation.mutateAsync().then((results) => {
          /** Mark as Calculated */
          calculatorRef.current.calculatedSource = true;

          const item = results[0];
          if (item) {
            form.setValue("amount", item["source_amount"]);
          }
        });
      } else {
        form.setValue("amount", "");
      }
    },
    500,
    [
      form,
      sourceAsset,
      receivedAsset,
      receivedAmount,
      receivedPathsMutation.mutateAsync,
    ]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Reserve Info */}
      <RequiredReserve />

      {/* Fee */}
      <TransactionsFee />

      {/* Source Asset */}
      {selectedSourceAsset ? (
        <AccountAsset asset={selectedSourceAsset} />
      ) : null}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Source Asset and Amount */}
          <Controller
            name="amount"
            disabled={
              form.formState.isSubmitting || receivedPathsMutation.isPending
            }
            render={({ field, fieldState }) => (
              <>
                {/* Source Amount */}
                <div className="flex gap-2">
                  <Input
                    {...field}
                    spellCheck={false}
                    className="grow min-w-0"
                    autoComplete={"off"}
                    placeholder={"0.0"}
                  />

                  {/* Picker */}
                  {defaultAsset === "" ? (
                    <Dialog.Root
                      open={showSourceAssetPicker}
                      onOpenChange={toggleSourceAssetPicker}
                    >
                      <AssetPickerTrigger
                        asset={selectedSourceAsset}
                        disabled={field.disabled}
                      />

                      <AssetPicker
                        assets={otherSourceAssets}
                        onSelect={handleSourceAssetPicker}
                      />
                    </Dialog.Root>
                  ) : null}
                </div>

                <div className="flex justify-end px-2">
                  {/* Asset Value */}
                  <AssetValue
                    asset={selectedSourceAsset}
                    amount={sourceAmount}
                  />

                  <div className="grow min-w-0 min-h-0">
                    <FieldStateError fieldState={fieldState} />
                  </div>
                  {selectedSourceAsset ? (
                    <button
                      type="button"
                      disabled={field.disabled}
                      onClick={() => field.onChange(maxAmount)}
                      className={cn(
                        "shrink-0",
                        "px-4 py-1 rounded-full",
                        "text-sm shrink-0 disabled:opacity-60",
                        "bg-blue-100 text-blue-800",
                        "dark:dark:bg-blue-500/20 text-blue-500"
                      )}
                    >
                      MAX
                    </button>
                  ) : null}
                </div>
              </>
            )}
          />

          {/* Swap Icon */}
          <div className="mb-2 flex justify-center items-center">
            {defaultAsset ? (
              <HiOutlineArrowLongDown className="size-6" />
            ) : (
              <button
                disabled={form.formState.isSubmitting}
                type="button"
                onClick={switchAssets}
                className={cn(
                  "p-3 rounded-full bg-neutral-100 dark:bg-neutral-800",
                  "disabled:opacity-60"
                )}
              >
                <HiOutlineArrowPath className="size-6" />
              </button>
            )}
          </div>

          {/* Received Asset and Amount */}
          <Controller
            name="receivedAmount"
            disabled={
              form.formState.isSubmitting || sendPathsMutation.isPending
            }
            render={({ field, fieldState }) => (
              <>
                {/* Received Amount */}
                <div className="flex gap-2">
                  <Input
                    {...field}
                    spellCheck={false}
                    className="grow min-w-0"
                    autoComplete={"off"}
                    placeholder={"0.0"}
                  />

                  {/* Picker */}
                  <Dialog.Root
                    open={showReceivedAssetPicker}
                    onOpenChange={toggleReceivedAssetPicker}
                  >
                    <AssetPickerTrigger
                      asset={selectedReceivedAsset}
                      disabled={field.disabled}
                    />
                    <AssetPicker
                      assets={otherReceivedAssets}
                      onSelect={handleReceivedAssetPicker}
                    />
                  </Dialog.Root>
                </div>

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Submit Button */}
          <PrimaryButton
            disabled={
              form.formState.isSubmitting ||
              sendPathsMutation.isPending ||
              receivedPathsMutation.isPending
            }
            type="submit"
            className="my-2"
          >
            {form.formState.isSubmitting ? "Swapping..." : "Swap"}
          </PrimaryButton>
        </form>

        {swapMutation.isSuccess ? (
          <p className="text-center text-green-500">
            Successful:{" "}
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/public/tx/${swapMutation.data.hash}`}
              className="text-blue-500"
            >
              View Details
            </a>
          </p>
        ) : swapMutation.isError ? (
          <p className="text-center text-red-500">Failed to Swap</p>
        ) : null}
      </FormProvider>
    </div>
  );
}
