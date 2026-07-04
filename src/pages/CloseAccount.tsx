import * as yup from "yup";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { HiOutlineBookOpen, HiOutlineTrash } from "react-icons/hi2";

import type { AccountRouteContext } from "@/types/index.d.ts";
import AddressPicker from "@/partials/AddressPicker";
import Alert from "@/components/Alert";
import { Dialog } from "@/components/Dialog";
import FieldStateError from "@/components/FieldStateError";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { StrKey } from "@stellar/stellar-sdk";
import TransactionsFee from "@/components/TransactionsFee";
import { cn } from "@/lib/utils";
import { createAccountMergeTransaction } from "@/lib/stellar/transactions";
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
    address: yup
      .string()
      .trim()
      .required()
      .test((str) => StrKey.isValidEd25519PublicKey(str))
      .label("Destination"),
    memo: yup.string().default("").trim().label("MEMO"),
  })
  .required();

interface CloseAccountFormValues {
  address: string;
  memo: string;
}

export default function CloseAccount() {
  const { account, balances, accountXLM, accountQuery } =
    useOutletContext<AccountRouteContext>();
  const accountList = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);
  const pinCode = useAppStore((state) => state.pinCode);
  const [showAddressPicker, toggleAddressPicker] = useLocationToggle(
    "__showAddressPicker",
  );

  /** Non-native trustlines must be removed before merging */
  const remainingTrustlines = useMemo(
    () => balances.filter((item) => item["asset_type"] !== "native"),
    [balances],
  );
  const canClose = remainingTrustlines.length === 0;

  /** Form */
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
      memo: "",
    },
  });

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
    mutationKey: [account.publicKey, "account", "merge"],
    mutationFn: async (data: CloseAccountFormValues) => {
      const transaction = await createAccountMergeTransaction({
        source: account.publicKey,
        destination: data.address,
        memo: data.memo,
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

  const handleFormSubmit = async (data: CloseAccountFormValues) => {
    if (data.address === account.publicKey) {
      form.setError("address", {
        message: "Can't merge into the same account",
      });
    } else {
      try {
        await mutation.mutateAsync(data);
        await accountQuery.refetch();
        form.reset();
      } catch (error) {
        console.warn("Error - Closing Account");
        console.error(error);
      }
    }
  };

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

  return (
    <div className="flex flex-col gap-2">
      {/* Warning */}
      <Alert variant={"warning"}>
        This transfers the entire{" "}
        <span className="font-bold">{accountXLM?.["balance"] || "0"} XLM</span>{" "}
        balance to the destination and permanently closes this account. This
        cannot be undone.
      </Alert>

      {/* Remaining Trustlines */}
      {!canClose ? (
        <Alert variant={"warning"}>
          Remove all trustlines before closing this account. You still have{" "}
          <span className="font-bold">{remainingTrustlines.length}</span>{" "}
          trustline(s) with a balance or reserve.
        </Alert>
      ) : null}

      <TransactionsFee />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-2"
        >
          {/* Destination */}
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

                <div className="flex gap-2">
                  <Input
                    {...field}
                    disabled={form.formState.isSubmitting}
                    spellCheck={false}
                    className="grow min-w-0"
                    autoComplete={"off"}
                    placeholder={"Destination Address"}
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

          {/* Submit Button */}
          <PrimaryButton
            disabled={!canClose || form.formState.isSubmitting}
            type="submit"
          >
            <HiOutlineTrash className="size-5" />
            {form.formState.isSubmitting ? "Closing..." : "Close Account"}
          </PrimaryButton>
        </form>

        {mutation.isSuccess ? (
          <p className="text-center text-green-500">
            Account closed successfully:{" "}
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/public/tx/${mutation.data.hash}`}
              className="text-blue-400"
            >
              View Details
            </a>
          </p>
        ) : mutation.isError ? (
          <p className="text-center text-red-500">Failed to Close Account</p>
        ) : null}
      </FormProvider>
    </div>
  );
}
