import Alert from "@/components/Alert";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { PrimaryButton } from "@/components/Button";
import { downloadFile } from "@/lib/utils";
import { exportAllKeys } from "@/lib/stellar/keyManager";

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
  return (
    <InnerAppLayout className="gap-2">
      <Alert variant={"info"}>All accounts and contacts will be exported</Alert>
      <PrimaryButton onClick={exportAll}>Export All</PrimaryButton>
    </InnerAppLayout>
  );
}
