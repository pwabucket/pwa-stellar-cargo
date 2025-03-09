import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { PrimaryButton } from "@/components/Button";
import { downloadFile } from "@/lib/utils";
import { exportAllKeys } from "@/lib/stellar/keyManager";

export default function BatchExport() {
  const pinCode = useAppStore((state) => state.pinCode);
  const accounts = useAppStore((state) => state.accounts);

  const exportAll = async () => {
    /** Get Keys */
    const keys = await exportAllKeys(pinCode);

    /** Download File */
    downloadFile(
      "stellar-cargo-accounts.json",
      JSON.stringify({
        keys,
        accounts,
      })
    );
  };
  return (
    <InnerAppLayout className="gap-2">
      <p className="text-center p-2 rounded-xl bg-blue-100 text-blue-800">
        All accounts will be exported
      </p>
      <PrimaryButton onClick={exportAll}>Export All</PrimaryButton>
    </InnerAppLayout>
  );
}
