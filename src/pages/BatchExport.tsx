import Alert from "@/components/Alert";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { HiOutlineArrowUpTray } from "react-icons/hi2";
import { PrimaryButton } from "@/components/Button";
import { downloadFile } from "@/lib/utils";
import { exportAllKeys } from "@/lib/stellar/keyManager";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function BatchExport() {
  const pinCode = useAppStore((state) => state.pinCode);
  const accounts = useAppStore((state) => state.accounts);
  const contacts = useAppStore((state) => state.contacts);

  const exportAll = async () => {
    /** Get Keys */
    const keys = await exportAllKeys(pinCode);

    /** Download File */
    downloadFile(
      "stellar-cargo-accounts.json",
      JSON.stringify({
        keys,
        accounts,
        contacts,
      })
    );
  };

  const mutation = useMutation({
    mutationKey: ["batch", "export"],
    mutationFn: async () => {
      await exportAll();
      toast.success("Exported successfully!");
    },
  });

  return (
    <InnerAppLayout className="gap-2">
      <Alert variant={"info"}>
        All accounts and contacts will be exported (unencrypted).
      </Alert>
      <PrimaryButton
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        <HiOutlineArrowUpTray className="size-5" />
        {mutation.isPending ? "Exporting..." : "Export All"}
      </PrimaryButton>
    </InnerAppLayout>
  );
}
