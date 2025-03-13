import * as Dialog from "@radix-ui/react-dialog";
import * as yup from "yup";
import AccountAsset from "@/components/AccountAsset";
import AccountBelowReserveError from "@/components/AccountBelowReserveError";
import AssetPicker from "@/partials/AssetPicker";
import FieldStateError from "@/components/FieldStateError";
import RequiredReserve from "@/components/RequiredReserve";
import useAppStore from "@/store/useAppStore";
import { Controller, useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { HiOutlineArrowLongDown } from "react-icons/hi2";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { cn } from "@/lib/utils";
import { createPathPaymentStrictSendTransaction } from "@/lib/stellar/transactions";
import {
  findStrictReceivePaths,
  findStrictSendPaths,
  submit,
} from "@/lib/stellar/horizonQueries";
import { signTransaction } from "@/lib/stellar/keyManager";
import { useDebounce } from "react-use";
import { useLocation } from "react-router";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import { useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

/** Schema */
const schema = yup
  .object({
    amount: yup.string().trim().required().label("Amount"),
    receivedAsset: yup.string().trim().required().label("Received Asset"),
    receivedAmount: yup.string().trim().required().label("Received Amount"),
  })
  .required();

export default function Swap() {
  const {
    account,
    asset,
    balances,
    accountQuery,
    accountIsBelowReserve,
    accountReserveBalance,
  } = useOutletContext();
  const navigate = useNavigate();
  const pinCode = useAppStore((state) => state.pinCode);
  const location = useLocation();
  const showAssetPicker = location.state?.__showAssetPicker === true;

  const otherAssets = useMemo(
    () =>
      balances.filter((item) => item["asset_issuer"] !== asset["asset_issuer"]),
    [asset, balances]
  );

  /** Toggle Address Picker */
  const toggleAssetPicker = (show) => {
    if (show) {
      navigate(null, {
        state: {
          ...location.state,
          __showAssetPicker: true,
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
      amount: "",
      receivedAsset: otherAssets[0]?.["transaction_name"] || "",
      receivedAmount: "",
    },
  });

  const accountPublicKey = account.publicKey;
  const calculatorRef = useRef({
    calculatedSource: false,
    calculatedReceived: false,
  });
  const amount = form.watch("amount");
  const receivedAsset = form.watch("receivedAsset");
  const receivedAmount = form.watch("receivedAmount");

  const selectedAsset = useMemo(
    () =>
      otherAssets.find((item) => item["transaction_name"] === receivedAsset),
    [receivedAsset, otherAssets]
  );

  const sourceAssetTransactionName = asset["transaction_name"];
  const sourceAssetCode = asset["asset_code"];
  const sourceAssetIssuer = asset["asset_issuer"];
  const receivedAssetCode = selectedAsset?.["asset_code"];
  const receivedAssetIssuer = selectedAsset?.["asset_issuer"];
  const receivedAssetTransactionName = selectedAsset?.["transaction_name"];

  const swapMutation = useMutation({
    mutationKey: [accountPublicKey, "swap", sourceAssetTransactionName],
    mutationFn: async (data) => {
      const { amount, receivedAsset, receivedAmount } = data;
      const transaction = await createPathPaymentStrictSendTransaction({
        source: accountPublicKey,
        sourceAsset: sourceAssetTransactionName,
        sourceAmount: amount,
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
    if (parseFloat(data.amount) > parseFloat(asset["balance"])) {
      form.setError("amount", {
        message: "Amount is greater than balance!",
      });
    } else {
      await swapMutation.mutateAsync(data);
      await accountQuery.refetch();
      form.setValue("amount", "");
      form.setValue("receivedAmount", "");
    }
  };

  /** Handle Picker */
  const handleAssetPicker = (asset) => {
    form.setValue("receivedAsset", asset["transaction_name"]);
  };

  const sendPathsMutation = useMutation({
    mutationKey: [accountPublicKey, "send", sourceAssetTransactionName],
    mutationFn: () =>
      findStrictSendPaths({
        destinationAsset: receivedAssetTransactionName,
        sourceAsset: sourceAssetTransactionName,
        sourceAmount: amount,
      }),
  });

  const receivedPathsMutation = useMutation({
    mutationKey: [accountPublicKey, "receive", sourceAssetTransactionName],
    mutationFn: () =>
      findStrictReceivePaths({
        sourceAsset: sourceAssetTransactionName,
        destinationAsset: receivedAsset,
        destinationAmount: receivedAmount,
      }),
  });

  /** Send Amount  */
  useDebounce(
    () => {
      if (calculatorRef.current.calculatedSource) {
        calculatorRef.current.calculatedSource = false;
      } else if (amount > 0) {
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
      amount,
      receivedAssetCode,
      receivedAssetIssuer,
      sendPathsMutation.mutateAsync,
    ]
  );

  /** Received Amount  */
  useDebounce(
    () => {
      if (calculatorRef.current.calculatedReceived) {
        calculatorRef.current.calculatedReceived = false;
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
      receivedAmount,
      sourceAssetCode,
      sourceAssetIssuer,
      receivedPathsMutation.mutateAsync,
    ]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Reserve Info */}
      <RequiredReserve balance={accountReserveBalance} />

      {/* Below Reserve info */}
      {accountIsBelowReserve ? (
        <AccountBelowReserveError
          accountReserveBalance={accountReserveBalance}
        />
      ) : null}

      {/* Source Asset */}
      <AccountAsset
        asset={asset}
        icon={asset["asset_icon"]}
        domain={asset["asset_domain"]}
      />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Source Amount */}
          <Controller
            name="amount"
            disabled={
              form.formState.isSubmitting || receivedPathsMutation.isPending
            }
            render={({ field, fieldState }) => (
              <>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    className="grow min-w-0"
                    type="number"
                    spellCheck={false}
                    autoComplete={"off"}
                    placeholder={"0.0"}
                  />

                  {/* Max */}
                  <button
                    type="button"
                    disabled={field.disabled}
                    onClick={() => field.onChange(asset["balance"])}
                    className="text-blue-500 shrink-0 disabled:opacity-60"
                  >
                    MAX
                  </button>
                </div>

                <FieldStateError fieldState={fieldState} />
              </>
            )}
          />

          {/* Swap Icon */}
          <div className="py-2 flex justify-center items-center">
            <HiOutlineArrowLongDown className="size-8" />
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
                    open={showAssetPicker}
                    onOpenChange={toggleAssetPicker}
                  >
                    <Dialog.Trigger
                      type="button"
                      disabled={field.disabled}
                      className={cn(
                        "shrink-0",
                        "bg-neutral-100 dark:bg-neutral-800",
                        "px-3 rounded-xl text-sm",
                        "flex gap-2 items-center",
                        "disabled:opacity-60"
                      )}
                    >
                      <img
                        src={selectedAsset["asset_icon"]}
                        className={cn(
                          "shrink-0 size-5 rounded-full",
                          "bg-white"
                        )}
                      />
                      {selectedAsset["asset_name"]}
                    </Dialog.Trigger>
                    <AssetPicker
                      assets={otherAssets}
                      onSelect={handleAssetPicker}
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
